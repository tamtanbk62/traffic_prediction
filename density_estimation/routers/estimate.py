from fastapi import APIRouter, Query
from pydantic import HttpUrl
from services.detection import detect_vehicles
from services.density_calculation import calculate_density
from utils.image_utils import load_image_from_url, load_image_from_file
from models.response_model import DensityResponse
import cv2
import numpy as np
import asyncio
import httpx
from more_itertools import chunked
import time

BATCH_SIZE = 10
SEM_LIMIT = 10
semaphore = asyncio.Semaphore(SEM_LIMIT)
#######

import httpx
from fastapi import HTTPException
from models.response_model import MultiDensityResponse, CameraDensity
from typing import List
from services.database import save_density_logs
#######


router = APIRouter()

@router.post("/", response_model=DensityResponse)
async def estimate_density(
    image_url: HttpUrl = Query(None),
    conf_threshold: float = Query(0.2, ge=0.0, le=1.0, description="Confidence threshold for detection")
):
    
    image = load_image_from_url(str(image_url))
    if image is None:
        return {"error": "Unable to read image."}

    boxes = detect_vehicles(image, conf_threshold=conf_threshold)
    density = calculate_density(image.shape[:2], boxes)
    return DensityResponse(density=density, num_boxes=len(boxes))



CAMERA_SERVICE_URL = "http://127.0.0.1:8001/api/cameras/"

async def process_camera(cam, conf_threshold):
    async with semaphore:
        cam_id = cam["camera_id"]
        snapshot_url = cam["snapshot_url"]

        try:
            image = await load_image_from_url_async(snapshot_url)
            if image is None:
                raise ValueError("Image load failed")

            boxes = detect_vehicles(image, conf_threshold=conf_threshold)
            density = calculate_density(image.shape[:2], boxes)

            return {
                "camera_id": cam_id,
                "density": density,
                "num_boxes": len(boxes),
                "error": None
            }
        except Exception as e:
            return {
                "camera_id": cam_id,
                "density": 0.0,
                "num_boxes": 0,
                "error": str(e)
            }

async def load_image_from_url_async(url):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10)
            response.raise_for_status()

            img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

            if img is None:
                raise ValueError("cv2.imdecode returned None")

            return img
    except Exception as e:
        raise RuntimeError(f"Failed to load image from {url}: {e}")

async def run_and_save_all_estimates(conf_threshold: float = 0.2):
    start = time.time()
    async with httpx.AsyncClient() as client:
        response = await client.get(CAMERA_SERVICE_URL)
        response.raise_for_status()
        cameras = response.json()

    logs = []
    for batch in chunked(cameras, BATCH_SIZE):
        tasks = [process_camera(cam, conf_threshold) for cam in batch]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logs.append({
                    "camera_id": batch[i]["camera_id"],
                    "density": 0.0,
                    "num_boxes": 0,
                    "error": str(result)
                })
            else:
                logs.append(result)

    save_density_logs(logs)
    end = time.time() - start
    with open("time_log.txt", "a", encoding="utf-8") as f:
        f.write(f"{end}\n")
    return logs

@router.get("/estimate-all", response_model=MultiDensityResponse)
async def estimate_all_cameras(conf_threshold: float = Query(0.2, ge=0.0, le=1.0)):
    logs = await run_and_save_all_estimates(conf_threshold)
    results = [CameraDensity(**log) for log in logs]
    return MultiDensityResponse(results=results)
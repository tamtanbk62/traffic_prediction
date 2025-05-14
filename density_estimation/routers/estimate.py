from fastapi import APIRouter, UploadFile, File, Query
from pydantic import HttpUrl
from services.detection import detect_vehicles
from services.density_calculation import calculate_density
from utils.image_utils import load_image_from_url, load_image_from_file
from models.response_model import DensityResponse
from datetime import datetime, timedelta
import cv2
import numpy as np
import sys
import os
#######

import httpx
from fastapi import HTTPException
from models.response_model import MultiDensityResponse, CameraDensity
from typing import List

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
# "http://camera_service:8000/api/cameras"  Docker

@router.get("/estimate-all", response_model=MultiDensityResponse)
async def estimate_all_cameras(conf_threshold: float = Query(0.2, ge=0.0, le=1.0)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(CAMERA_SERVICE_URL)
            response.raise_for_status()
            cameras = response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch cameras: {e}")

    results: List[CameraDensity] = []

    for cam in cameras:
        cam_id = cam["camera_id"]
        snapshot_url = cam["snapshot_url"]

        try:
            image = load_image_from_url(snapshot_url)
            if image is None:
                raise ValueError("Image load failed")

            boxes = detect_vehicles(image, conf_threshold=conf_threshold)
            density = calculate_density(image.shape[:2], boxes)

            results.append(CameraDensity(
                camera_id=cam_id,
                density=density,
                num_boxes=len(boxes)
            ))
        except Exception as e:
            results.append(CameraDensity(
                camera_id=cam_id,
                density=0.0,
                num_boxes=0,
                error=str(e)
            ))

    return MultiDensityResponse(results=results)


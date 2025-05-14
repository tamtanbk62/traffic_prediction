from fastapi import APIRouter, HTTPException
from services.camera_data import get_all_cameras, get_camera_by_id
from models.camera import Camera
from typing import List

router = APIRouter()

@router.get("/", response_model=List[Camera])
def list_cameras():
    return get_all_cameras()

@router.get("/{camera_id}", response_model=Camera)
def camera_detail(camera_id: str):
    camera = get_camera_by_id(camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera
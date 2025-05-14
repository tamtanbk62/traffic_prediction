from fastapi import APIRouter
from services.proxy_camera import get_all_cameras, get_camera_by_id

router = APIRouter()

@router.get("/")
async def list_cameras():
    return await get_all_cameras()

@router.get("/{camera_id}")
async def camera_detail(camera_id: str):
    return await get_camera_by_id(camera_id)
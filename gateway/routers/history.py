from fastapi import APIRouter
from services.proxy_history import get_history_density

router = APIRouter()


@router.get("/")
async def history_density(camera_id: str):
    return await get_history_density(camera_id)
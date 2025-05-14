from fastapi import APIRouter, Query
from services.proxy_estimate import estimate_density, estimate_all

router = APIRouter()

@router.get("/")
async def proxy_estimate_density(image_url: str, conf_threshold: float = Query(0.2)):
    return await estimate_density(image_url, conf_threshold)

@router.get("/estimate-all")
async def proxy_estimate_all(conf_threshold: float = Query(0.2)):
    return await estimate_all(conf_threshold)
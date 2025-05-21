import httpx

# CAMERA_SERVICE_URL = "http://camera_service:8001/api/cameras"
CAMERA_SERVICE_URL = "http://127.0.0.1:8001/api/cameras"
async def get_all_cameras():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{CAMERA_SERVICE_URL}/")
        return resp.json()

async def get_camera_by_id(camera_id: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{CAMERA_SERVICE_URL}/{camera_id}")
        return resp.json()
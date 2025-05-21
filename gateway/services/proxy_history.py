import httpx

HISTORY_SERVICE_URL = "http://data_storage:8004/api/density/latest"
# HISTORY_SERVICE_URL = "http://127.0.0.1:8004/api/density/latest"

async def get_history_density(camera_id: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{HISTORY_SERVICE_URL}?camera_id={camera_id}&within_minutes={60}")
        return resp.json()
import httpx

HISTORY_SERVICE_URL = "http://127.0.0.1:8004/api/history"


async def get_history_density(camera_id: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{HISTORY_SERVICE_URL}/{camera_id}")
        return resp.json()
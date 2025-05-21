import httpx

# ESTIMATE_URL = "http://density_estimation:8002/api/estimate"
ESTIMATE_URL = "http://127.0.0.1:8002/api/estimate"
async def estimate_density(image_url: str, conf_threshold: float):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{ESTIMATE_URL}/",
            params={"image_url": image_url, "conf_threshold": conf_threshold}
        )
        return resp.json()

async def estimate_all(conf_threshold: float):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{ESTIMATE_URL}/estimate-all",
            params={"conf_threshold": conf_threshold}
        )
        return resp.json()
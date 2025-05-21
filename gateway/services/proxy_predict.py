import httpx

PREDICT_URL = "http://density_prediction:8003/api/predict"
# PREDICT_URL = "http://127.0.0.1:8003/api/predict"
async def predict_density(data: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(PREDICT_URL + "/", json=data.dict())
        response.raise_for_status()
        return response.json()
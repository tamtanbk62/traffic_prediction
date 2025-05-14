from fastapi import APIRouter
from services.proxy_predict import predict_density
from models.predict_model import PredictionRequest, PredictionResponse

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
async def proxy_predict(request: PredictionRequest):
    return await predict_density(request)
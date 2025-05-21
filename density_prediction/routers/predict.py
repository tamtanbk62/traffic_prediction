# routers/predict.py
from fastapi import APIRouter, HTTPException
from models.request_response import PredictionRequest, PredictionResponse
from services.predictor import predict_density

router = APIRouter()

@router.post("/", response_model=PredictionResponse, status_code=200)
def predict(request: PredictionRequest):
    try:
        result = predict_density(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

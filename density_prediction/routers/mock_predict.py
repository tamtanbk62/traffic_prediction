from fastapi import APIRouter
from models.request_response import PredictionRequest, PredictionResponse

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
def mock_predict_density(request: PredictionRequest):
    avg = sum(request.recent_densities) / len(request.recent_densities)
    return PredictionResponse(
        camera_id=request.camera_id,
        predicted_density=round(avg * 1.1, 4)  # giả lập: tăng 10%
    )
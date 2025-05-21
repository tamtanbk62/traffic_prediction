# models/request_response.py
from pydantic import BaseModel

class PredictionRequest(BaseModel):
    camera_id: str  # Chỉ cần camera_id để lấy dữ liệu từ API

class PredictionResponse(BaseModel):
    camera_id: str
    predicted_density: float

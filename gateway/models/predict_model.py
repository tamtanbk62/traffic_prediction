from pydantic import BaseModel
from typing import List

class PredictionRequest(BaseModel):
    camera_id: str
    recent_densities: List[float]  # Ví dụ: [0.1, 0.15, 0.2, ...]

class PredictionResponse(BaseModel):
    camera_id: str
    predicted_density: float
from pydantic import BaseModel
from typing import List

class PredictionRequest(BaseModel):
    camera_id: str

class PredictionResponse(BaseModel):
    camera_id: str
    predicted_density: float
from pydantic import BaseModel
from typing import List, Optional

class DensityResponse(BaseModel):
    density: float
    num_boxes: int

class CameraDensity(BaseModel):
    camera_id: str
    density: float
    num_boxes: int
    error: Optional[str] = None  # Có thể có hoặc không nếu không xảy ra lỗi

class MultiDensityResponse(BaseModel):
    results: List[CameraDensity]
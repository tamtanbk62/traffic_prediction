from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DensityRecord(BaseModel):
    camera_id: str
    density: float
    num_boxes: int
    timestamp: datetime
    error: Optional[str] = None

class DensityResponse(BaseModel):
    camera_id: str
    density: float
    timestamp: datetime

class DensityResponseList(BaseModel):
    records: list[DensityRecord]
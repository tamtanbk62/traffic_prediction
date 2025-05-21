from fastapi import APIRouter, HTTPException, Query
from services.database import get_density_records
from models.response_model import DensityResponseList, DensityRecord

router = APIRouter()

@router.get("/latest", response_model=DensityResponseList)
def get_latest_density_records(
    camera_id: str,
    within_minutes: int = Query(60, ge=1, le=1440)
):
    records = get_density_records(camera_id, within_minutes)
    if not records:
        raise HTTPException(status_code=404, detail="No density records found")

    parsed = [
        DensityRecord(
            camera_id=r["camera_id"],
            density=r["density"],
            num_boxes=r["num_boxes"],
            timestamp=r["timestamp"],
            error=r.get("error")
        )
        for r in records
    ]

    return DensityResponseList(records=parsed)
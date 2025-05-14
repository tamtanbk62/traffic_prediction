from fastapi import APIRouter
from datetime import datetime, timedelta
from db import density_collection
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/history/{camera_id}")
def get_history(camera_id: str):
    now = datetime.now()
    one_hour_ago = now - timedelta(hours=1)

    records = density_collection.find({
        "camera_id": camera_id,
        "timestamp": {"$gte": one_hour_ago.isoformat()}
    }).sort("timestamp", 1)

    history = [
        {
            "time": r["timestamp"],
            "density": round(float(r["density"]), 3)
        }
        for r in records
    ]

    return JSONResponse(content=history)
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["traffic_density"]
collection = db["density_logs"]

def get_density_records(camera_id: str, within_minutes: int = 60):
    cutoff = datetime.utcnow() - timedelta(minutes=within_minutes)

    results = collection.find(
        {
            "camera_id": camera_id,
            "timestamp": {"$gte": cutoff}
        }
    ).sort("timestamp", -1)  # Sắp xếp mới nhất trước
    return list(results)


import csv
from models.camera import Camera
from pathlib import Path

CAMERA_FILE = Path(__file__).parent.parent / "data" / "camera_data.csv"

_cache = []

def _load_data():
    global _cache
    with open(CAMERA_FILE, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        _cache = [Camera(
            camera_id=row["camera_id"],
            point=row["Point"],
            location1=row["Location1"],
            location2=row["Location2"],
            angle=row["Camera Angle"],
            snapshot_url=row["SnapshotUrl"]
        ) for row in reader]


if not _cache:
    _load_data()

def get_all_cameras():
    return _cache

def get_camera_by_id(camera_id: str):
    return next((cam for cam in _cache if cam.camera_id == camera_id), None)
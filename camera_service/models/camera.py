from pydantic import BaseModel

class Camera(BaseModel):
    camera_id: str
    point: str
    location1: str | None = None
    location2: str | None = None
    angle: str | None = None
    snapshot_url: str
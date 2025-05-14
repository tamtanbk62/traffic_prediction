# Camera Service

This microservice provides APIs to serve camera metadata for traffic systems.

## Run Locally
```bash
uvicorn app:app --reload
```

## API Endpoints
- `GET /api/cameras/` - List all cameras
- `GET /api/cameras/{camera_id}` - Get a specific camera by ID

## CSV Format Required:
```
camera_id,Point,Location1,Location2,Camera Angle,SnapshotUrl
```
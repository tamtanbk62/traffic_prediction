from fastapi import FastAPI
from routers import cameras
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Camera Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cameras.router, prefix="/api/cameras", tags=["Cameras"])
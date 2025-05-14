from fastapi import FastAPI
from routers.estimate import router as estimate_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Traffic Density Estimation Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(estimate_router, prefix="/api/estimate", tags=["Density Estimation"])
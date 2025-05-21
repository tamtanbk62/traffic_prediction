from fastapi import FastAPI
from routers import camera, estimate, predict, history
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Traffic Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(camera.router, prefix="/api/cameras", tags=["Camera"])
app.include_router(estimate.router, prefix="/api/estimate", tags=["Estimate"])
app.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(history.router, prefix="/api/density/latest", tags=["History"])
from fastapi import FastAPI
from routers.predict import router as predict_router
from routers.mock_predict import router as mock_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Traffic Density Prediction")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api/predict", tags=["Density Prediction"])
app.include_router(mock_router, prefix="/api/predict/mock", tags=["Mock Prediction"])
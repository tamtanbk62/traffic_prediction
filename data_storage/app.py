from fastapi import FastAPI
from routers.history import router as history_router

app = FastAPI(title="Data Storage Service")
app.include_router(history_router, prefix="/api/history", tags=["History"])
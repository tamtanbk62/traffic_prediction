from pymongo import MongoClient
from datetime import datetime

MONGO_URI = "mongodb+srv://tamtanbk62:tung123456@cluster0.mvtkvfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["traffic_density"]  # Database name
collection = db["density_logs"]  # Collection name

def save_density_logs(logs: list):
    for log in logs:
        log["timestamp"] = datetime.utcnow()
    collection.insert_many(logs)
from models.request_response import PredictionRequest, PredictionResponse
from services.model_loader import loadmodel
import numpy as np
import requests
import pandas as pd
from typing import Optional, List
import pickle
from httpx import get

limit_records = 30

model = loadmodel()

# Tải scaler và camera_id_map
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("camera_id_map.pkl", "rb") as f:
    camera_id_to_index = pickle.load(f)

def get_last_30_samples_for_camera(camera_id: str, sequence_length: int = limit_records) -> Optional[List[List[float]]]:
    url = f"http://127.0.0.1:8004/api/density/latest?camera_id={camera_id}&within_minutes={600}"
    
    try:
        response = get(url)
        response.raise_for_status()
        data = response.json()
        records = data.get("records", [])
        with open("debug_log.txt", "w", encoding="utf-8") as f:
            f.write("=== RECORDS ===\n")
            f.write(f"{len(records)}\n")
            f.write(str(records) + "\n")

        if len(records) < sequence_length:
            return None  # Trả về None nếu không đủ dữ liệu

        # Sắp xếp bản ghi theo thời gian tăng dần
        sorted_records = sorted(records, key=lambda x: x["timestamp"])

        # Lấy sequence_length bản ghi cuối cùng
        recent_records = sorted_records[-sequence_length:]

        # Xử lý bản ghi để trích xuất density, hour, minute, day_of_week
        time_data = []
        for record in recent_records:
            timestamp = pd.to_datetime(record["timestamp"])
            hour = timestamp.hour
            minute = timestamp.minute
            day_of_week = timestamp.weekday()  # 0: Thứ Hai, 6: Chủ Nhật
            density = record["density"]
            time_data.append([density, hour, minute, day_of_week])

        return time_data

    except requests.RequestException as e:
        print(f"Lỗi khi lấy dữ liệu từ API: {e}")
        return None

def create_sequence_for_inference(camera_id, time_data, sequence_length):
    camera_id_encoded = camera_id_to_index.get(camera_id, None)
    if camera_id_encoded is None:
        return None

    # Gộp camera_id_encoded vào từng dòng của time_data
    sequence = [row + [camera_id_encoded] for row in time_data[-sequence_length:]]
    sequence = np.array(sequence)  # shape (5, 5)
    return np.reshape(sequence, (1, sequence_length, 5))  # shape (1, 5, 5)

def predict_density(request: PredictionRequest) -> PredictionResponse:
    camera_id = request.camera_id
    time_data = get_last_30_samples_for_camera(camera_id)

    if time_data is None:
        raise ValueError("Không đủ dữ liệu đầu vào cho camera_id.")

    sequence = create_sequence_for_inference(camera_id, time_data, sequence_length=limit_records)

    if sequence is None:
        raise ValueError(f"Không tìm thấy mã hóa camera_id '{camera_id}'.")

    # Dự đoán mật độ giao thông
    predicted_density = model.predict(sequence)

    # Chuyển đổi giá trị dự đoán về thang đo gốc (khoảng giá trị ban đầu)
    predicted_density_rescaled = scaler.inverse_transform(predicted_density)

    return PredictionResponse(
        camera_id=camera_id,
        predicted_density=predicted_density_rescaled[0][0]
    )
from ultralytics import YOLO
import torch
import numpy as np
import cv2
from typing import List, Tuple

# Load YOLOv9 model tại thời điểm module được import
MODEL_PATH = "weight/detection.pt"
model = YOLO(MODEL_PATH)


def detect_vehicles(image: np.ndarray, conf_threshold: float = 0.2) -> List[Tuple[int, int, int, int]]:
    """
    Chạy YOLO trên ảnh và trả về danh sách bounding boxes (x1, y1, x2, y2) của phương tiện.
    
    Parameters:
        image: ảnh đầu vào
        conf_threshold: ngưỡng confidence để lọc kết quả
    
    Returns:
        List bounding boxes (x1, y1, x2, y2)
    """
    height, width = image.shape[:2]
    if max(height, width) > 1280:
        scale = 1280 / max(height, width)
        image = cv2.resize(image, (int(width * scale), int(height * scale)))

    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    results = model(image_rgb, conf=conf_threshold)[0]

    boxes = []
    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
        boxes.append((x1, y1, x2, y2))

    return boxes
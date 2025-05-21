import requests
from io import BytesIO
from PIL import Image
import numpy as np

def load_image_from_url(url: str) -> np.ndarray:
    """Tải ảnh từ URL và chuyển thành NumPy array"""
    response = requests.get(url)
    response.raise_for_status()
    image = Image.open(BytesIO(response.content)).convert("RGB")
    return np.array(image)

def load_image_from_file(file) -> np.ndarray:
    """Tải ảnh từ file (UploadFile) và chuyển thành NumPy array"""
    image = Image.open(file.file).convert("RGB")
    return np.array(image)
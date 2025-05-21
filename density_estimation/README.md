# Traffic Density Estimation Service

Dịch vụ này sử dụng mô hình YOLOv9 để nhận diện phương tiện giao thông từ ảnh và tính toán mật độ dựa trên diện tích không chồng lặp của các bounding boxes.

## Khởi chạy
```bash
uvicorn app:app --reload
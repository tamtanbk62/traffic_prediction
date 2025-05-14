# traffic_prediction
Hệ thống dự báo mật độ giao thông sử dụng kiến trúc **microservice**
- `camera_service`: cung cấp thông tin camera
- `density_estimation`: nhận diện và tính mật độ từ ảnh
- `density_prediction`: dự đoán mật độ trong tương lai
- `data_storage`: lưu trữ lịch sử mật độ
- `gateway`: API Gateway giao tiếp giữa các service
- `frontend`: giao diện web hiển thị dữ liệu
  
## Run services
```bash
docker compose up --build
```
## Run frontend
```bash
cd frontend
npm install
npm run dev
```



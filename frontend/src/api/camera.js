const BASE_URL = "http://camera_service:8000/api/cameras"; // <-- gọi tới gateway

// Lấy danh sách toàn bộ camera
export async function getAllCameras() {
  const res = await fetch(BASE_URL + "/");
  if (!res.ok) throw new Error("Failed to fetch cameras");
  return await res.json();
}

// Lấy thông tin camera cụ thể + snapshot
export async function getCameraSnapshot(cameraId) {
  // Lấy info camera
  const res = await fetch(`${BASE_URL}/${cameraId}`);
  if (!res.ok) throw new Error("Camera not found");
  const data = await res.json();

  // Tính mật độ qua API estimate 
  const estimateRes = await fetch(`http://density_estimation:8000/api/estimate/?image_url=${encodeURIComponent(data.snapshot_url)}&conf_threshold=0.2`);
  const estimate = await estimateRes.json();

  return {
    name: data.location2 || "Không rõ",
    image_url: data.snapshot_url,
    density: estimate.density || 0
  };
}

export async function getDensityHistory(cameraId) {
  const response = await fetch(`http://data_storage:8000/api/density/latest?camera_id=${cameraId}&within_minutes=60`);

  if (!response.ok) {
    throw new Error("Failed to fetch density history");
  }

  const data_res = await response.json();
  const records = data_res.records || [];

  // Sắp xếp theo timestamp tăng dần
  records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const data = records.map(record => {
    // Tăng thời gian thêm 7 giờ
    const time = new Date(new Date(record.timestamp).getTime() + 7 * 60 * 60 * 1000);
    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      density: +record.density.toFixed(4)
    };
  });

  return data;
}

// Dự đoán mật độ tiếp theo dựa trên mock history
// export async function getMockPrediction(cameraId, recentDensities) {
//   const avg = recentDensities.reduce((a, b) => a + b, 0) / recentDensities.length;
//   return { predicted_density: +(avg * 1.1).toFixed(2) };
// }

export async function getPrediction(cameraId) {
  // Gửi POST request tới API dự đoán mật độ thông qua gateway

  const res = await fetch(`http://density_prediction:8000/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ camera_id: cameraId }) // khớp với PredictionRequest
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to predict");
  }

  const data = await res.json(); // { camera_id: "...", predicted_density: ... }
  return data;
}


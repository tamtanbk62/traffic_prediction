const BASE_URL = "http://localhost:8000/api/cameras"; // <-- gọi tới gateway

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
  const estimateRes = await fetch(`http://localhost:8000/api/estimate/?image_url=${encodeURIComponent(data.snapshot_url)}&conf_threshold=0.2`);
  const estimate = await estimateRes.json();

  return {
    name: data.location2 || "Không rõ",
    image_url: data.snapshot_url,
    density: estimate.density || 0
  };
}

// Trả về 12 điểm dữ liệu trong 1 giờ qua, mỗi 5 phút
export async function getMockDensityHistory(cameraId) {
  const now = new Date();
  const data = [];

  for (let i = 11; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      density: +(Math.random() * 0.5 + 0.1).toFixed(2)
    });
  }

  return data;
}

// Dự đoán mật độ dựa trên mock history
export async function getMockPrediction(cameraId, recentDensities) {
  const avg = recentDensities.reduce((a, b) => a + b, 0) / recentDensities.length;
  return { predicted_density: +(avg * 1.1).toFixed(2) };
}

// export async function getDensityHistory(cameraId) {
//   const res = await fetch(`http://localhost:8000/api/estimate/history/${cameraId}`);
//   if (!res.ok) {
//     throw new Error("Failed to fetch history");
//   }
//   const data = await res.json();

//   // Chuyển ISO timestamp thành giờ:phút
//   return data.map(item => ({
//     time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     density: item.density
//   }));
// }

// export async function getPrediction(recentDensities) {
//   const res = await fetch(`http://localhost:8000/api/predict`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(recentDensities)
//   });

//   if (!res.ok) {
//     throw new Error("Failed to predict");
//   }

//   return await res.json();  // { predicted_density: ... }
// }

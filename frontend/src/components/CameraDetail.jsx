import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCameraSnapshot, getMockDensityHistory, getMockPrediction } from '../api/camera.js';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function CameraDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [predicted, setPredicted] = useState(null);

  // Load ban đầu + định kỳ mỗi 15s
  useEffect(() => {
    let intervalId;

    async function fetchSnapshotAndPrediction() {
      const info = await getCameraSnapshot(id);
      setData(info);

      const historyData = await getMockDensityHistory(id);
      setHistory(historyData);

      const densities = historyData.map(d => d.density);
      const pred = await getMockPrediction(id, densities);
      setPredicted(pred.predicted_density);
    }

    fetchSnapshotAndPrediction();
    intervalId = setInterval(fetchSnapshotAndPrediction, 15000);

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [id]);

  if (!data) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chi tiết Camera</h2>
      <p><strong>Vị trí:</strong> {data.name}</p>
      <p><strong>Mật độ hiện tại:</strong> {data.density}</p>
      <img src={data.image_url + `?t=${Date.now()}`} width="400" alt="Hiện tại" />

      <h3>Mật độ 1 giờ qua</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Line type="monotone" dataKey="density" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <p><strong>Dự báo mật độ trong 10 phút tiếp theo:</strong> {predicted}</p>
    </div>
  );
}
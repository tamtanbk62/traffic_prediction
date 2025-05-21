import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCameraSnapshot, getDensityHistory, getPrediction } from '../api/camera.js';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function CameraDetail({ theme }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [predicted, setPredicted] = useState(null);
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lấy dữ liệu camera
  useEffect(() => {
    let intervalId;

    async function fetchSnapshotAndPrediction() {
      const info = await getCameraSnapshot(id);
      setData(info);

      const historyData = await getDensityHistory(id);
      setHistory(historyData);

      const density = historyData.map(d => d.density);
      const pred = await getPrediction(id);
      setPredicted(pred.predicted_density);
    }

    fetchSnapshotAndPrediction();
    intervalId = setInterval(fetchSnapshotAndPrediction, 15000);

    return () => clearInterval(intervalId);
  }, [id]);

  if (!data) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#242424',
      color: theme === 'light' ? '#213547' : 'white',
      fontSize: '16px',
      fontWeight: '500'
    }}>
      Đang tải dữ liệu...
    </div>
  );

  return (
    <div style={{
      padding: '24px',
      paddingTop: '20px',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: theme === 'light' ? '#ffffff' : '#2a2a2a',
      color: theme === 'light' ? '#213547' : 'rgba(255, 255, 255, 0.87)',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      fontFamily: 'system-ui, -apple-system, Arial, sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          margin: 0,
          color: theme === 'light' ? '#1a2b4a' : '#e0e0e0'
        }}>
          Chi tiết Camera
        </h2>
        <button
          onClick={() => window.close()} // Đóng tab hiện tại
          style={{
            padding: '8px 16px',
            backgroundColor: theme === 'light' ? '#007bff' : '#0056b3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: theme === 'light' ? '#0056b3' : '#003d82'
            }
          }}
        >
          Quay lại
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isSmallScreen ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: isSmallScreen ? '16px' : '24px',
        width: '100%'
      }}>
        {/* Left Column: Image and Basic Info */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: theme === 'light' ? '#fafafa' : '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <img
              src={data.image_url + `?t=${Date.now()}`}
              alt="Camera Snapshot"
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                borderRadius: '8px',
                objectFit: 'cover',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: theme === 'light' ? '#f8f9fa' : '#3a3a3a',
            borderRadius: '8px'
          }}>
            <p style={{ margin: '0 0 8px', fontSize: '20px' }}>
              <strong>Vị trí:</strong> {data.name}
            </p>
            <p style={{ margin: 0, fontSize: '20px' }}>
              <strong>Mật độ hiện tại:</strong> {data.density?.toFixed(4)}
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '20px' }}>
              <strong>Dự báo (10 phút tới):</strong> {predicted?.toFixed(4) || 'Đang tính toán...'}
            </p>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '500',
            margin: 0,
            color: theme === 'light' ? '#1a2b4a' : '#e0e0e0'
          }}>
            Lịch sử mật độ (1 giờ qua)
          </h3>
          <div style={{
            backgroundColor: theme === 'light' ? '#ffffff' : '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            flexGrow: 1
          }}>
            <ResponsiveContainer width="100%" height={isSmallScreen ? 300 : 400}>
              <LineChart data={history}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === 'light' ? '#e0e0e0' : '#555'}
                />
                <XAxis
                  dataKey="time"
                  stroke={theme === 'light' ? '#213547' : '#e0e0e0'}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 1]}
                  stroke={theme === 'light' ? '#213547' : '#e0e0e0'}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'light' ? '#ffffff' : '#2a2a2a',
                    color: theme === 'light' ? '#213547' : '#e0e0e0',
                    border: `1px solid ${theme === 'light' ? '#ccc' : '#555'}`,
                    borderRadius: '6px',
                    padding: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="density"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
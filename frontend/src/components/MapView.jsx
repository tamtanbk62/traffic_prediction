import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllCameras } from '../api/camera.js';

export default function MapView({ onCameraClick, theme }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getAllCameras();
      const parsed = data.map(cam => {
        const match = cam.point.match(/POINT\(([\d.]+) ([\d.]+)\)/);
        const lng = parseFloat(match[1]);
        const lat = parseFloat(match[2]);
        return {
          id: cam.camera_id,
          name: cam.location2 || "Không rõ",
          lat,
          lng,
          snapshot_url: cam.snapshot_url
        };
      });
      setCameras(parsed);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      setCameras(prev => prev.map(cam => ({
        ...cam,
        snapshot_url: `${cam.snapshot_url}?t=${Date.now()}`
      })));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#242424',
        color: theme === 'light' ? '#213547' : '#e0e0e0',
        fontSize: 'clamp(14px, 2.5vw, 16px)',
        fontWeight: '500'
      }}>
        Đang tải bản đồ...
      </div>
    );
  }

  return (
    <MapContainer
      center={[10.762622, 106.660172]}
      zoom={13}
      style={{
        height: '100%',
        width: '100%',
        flexGrow: 1,
        borderRadius: 'clamp(4px, 1vw, 8px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1
      }}
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map((cam) => (
        <Marker key={cam.id} position={[cam.lat, cam.lng]}>
          <Popup>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(8px, 2vw, 12px)',
              maxWidth: 'clamp(200px, 60vw, 280px)',
              minWidth: 'clamp(180px, 50vw, 200px)',
              fontSize: 'clamp(13px, 2.5vw, 14px)',
              backgroundColor: theme === 'light' ? '#ffffff' : '#333',
              color: theme === 'light' ? '#213547' : '#e0e0e0',
              padding: 'clamp(8px, 2vw, 12px)',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}>
              <strong style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: '600' }}>{cam.name}</strong>
              <img
                src={cam.snapshot_url}
                alt="Snapshot"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '6px',
                  objectFit: 'cover',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              />
              <div style={{
                display: 'flex',
                gap: 'clamp(8px, 2vw, 12px)',
                width: '100%',
                justifyContent: 'center',
                flexWrap: 'nowrap'
              }}>
                <button
                  onClick={() => onCameraClick(cam.id, cam.name)}
                  style={{
                    padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
                    backgroundColor: theme === 'light' ? '#007bff' : '#0056b3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontWeight: '500',
                    flex: '1 1 0', // Chia đều không gian
                    minWidth: '0', // Ngăn nút bị ép quá nhỏ
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s, transform 0.2s',
                    ':hover': {
                      backgroundColor: theme === 'light' ? '#0056b3' : '#003d82',
                      transform: 'scale(1.05)'
                    },
                    ':focus': {
                      outline: `2px solid ${theme === 'light' ? '#007bff' : '#0056b3'}`,
                      outlineOffset: '2px'
                    }
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'light' ? '#0056b3' : '#003d82';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'light' ? '#007bff' : '#0056b3';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Theo dõi
                </button>
                <button
                  onClick={() => window.open(`/camera/${cam.id}`, '_blank')}
                  style={{
                    padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
                    backgroundColor: theme === 'light' ? '#6c757d' : '#5a6268',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontWeight: '500',
                    flex: '1 1 0', // Chia đều không gian
                    minWidth: '0', // Ngăn nút bị ép quá nhỏ
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s, transform 0.2s',
                    ':hover': {
                      backgroundColor: theme === 'light' ? '#5a6268' : '#4b545c',
                      transform: 'scale(1.05)'
                    },
                    ':focus': {
                      outline: `2px solid ${theme === 'light' ? '#6c757d' : '#5a6268'}`,
                      outlineOffset: '2px'
                    }
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'light' ? '#5a6268' : '#4b545c';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'light' ? '#6c757d' : '#5a6268';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
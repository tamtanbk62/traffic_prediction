import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllCameras, getCameraSnapshot } from '../api/camera.js';

export default function MapView({ onCameraClick }) {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllCameras();
      // Parse toạ độ từ chuỗi POINT(...)
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

  return (
    <MapContainer center={[10.762622, 106.660172]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map((cam) => (
        <Marker key={cam.id} position={[cam.lat, cam.lng]}>
          <Popup>
            <strong>{cam.name}</strong><br />
            <img src={cam.snapshot_url} width="250" alt="Snapshot" /><br />
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button onClick={() => onCameraClick(cam.id, cam.name)}>Theo dõi</button>
              <button onClick={() => window.open(`/camera/${cam.id}`, '_blank')}>Xem chi tiết</button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
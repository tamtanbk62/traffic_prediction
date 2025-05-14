import { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapView from './components/MapView.jsx';
import { getCameraSnapshot } from './api/camera.js';
import BottomPanel from './components/BottomPanel.jsx';
import CameraDetail from './components/CameraDetail.jsx';
import Header from './components/Header.jsx';
//import './App.css';

function App() {
  const [snapshot, setSnapshot] = useState(null);
  const [density, setDensity] = useState(null);
  const resultRef = useRef(null);
  const [trigger, setTrigger] = useState(0);
  const [cameraName, setCameraName] = useState('');
  const handleCameraClick = async (cameraId, name) => {
    const data = await getCameraSnapshot(cameraId);
    setSnapshot(data.image_url);
    setDensity(data.density);
    setTrigger(prev => prev + 1);  // 👈 Tăng trigger để ép panel xử lý lại
    setCameraName(name);
    // Cuộn xuống phần hiển thị ảnh
    // setTimeout(() => {
    //   resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    // }, 100);
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
          <MapView onCameraClick={handleCameraClick} />
          <BottomPanel snapshot={snapshot} density={density} trigger={trigger} name={cameraName} />
          </>
        }/>
        <Route path="/camera/:id" element={<CameraDetail />} />
      </Routes>
    </Router>     
  );
}

export default App;
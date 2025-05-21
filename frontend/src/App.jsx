import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapView from './components/MapView.jsx';
import { getCameraSnapshot } from './api/camera.js';
import BottomPanel from './components/BottomPanel.jsx';
import CameraDetail from './components/CameraDetail.jsx';
import Header from './components/Header.jsx';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [snapshot, setSnapshot] = useState(null);
  const [density, setDensity] = useState(null);
  const [trigger, setTrigger] = useState(0);
  const [cameraName, setCameraName] = useState('');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.style.backgroundColor = theme === 'light' ? '#f5f5f5' : '#242424';
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleCameraClick = async (cameraId, name) => {
    const data = await getCameraSnapshot(cameraId);
    setSnapshot(data.image_url);
    setDensity(data.density);
    setTrigger((prev) => prev + 1);
    setCameraName(name);
  };

  return (
    <Router>
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme === 'light' ? '#f5f5f5' : '#242424',
          color: theme === 'light' ? '#213547' : 'rgba(255, 255, 255, 0.87)',
          margin: 0,
          padding: 0,
          fontFamily: 'system-ui, -apple-system, Arial, sans-serif',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
      >
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <MapView onCameraClick={handleCameraClick} theme={theme} />
                  <BottomPanel
                    snapshot={snapshot}
                    density={density}
                    trigger={trigger}
                    name={cameraName}
                    theme={theme}
                  />
                </>
              }
            />
            <Route path="/camera/:id" element={<CameraDetail theme={theme} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
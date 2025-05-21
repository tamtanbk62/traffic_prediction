import { useState, useEffect } from 'react';
import { getCameraSnapshot } from '../api/camera';

export default function BottomPanel({ snapshot, density, trigger, name, theme }) {
  const [open, setOpen] = useState(true);
  const [snapshots, setSnapshots] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (!snapshot || !trigger) return;

    const isDuplicate = snapshots.some(s => s.image_url === snapshot);
    if (isDuplicate) {
      setOpen(true);
      return;
    }

    if (snapshots.length < 10) {
      setSnapshots(prev => [...prev, {
        camera_id: snapshot.split('/').pop(),
        image_url: snapshot,
        density,
        name
      }]);
      setOpen(true);
    }
  }, [trigger]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const updated = await Promise.all(snapshots.map(async (snap) => {
        try {
          const newSnap = await getCameraSnapshot(snap.camera_id);
          return {
            ...snap,
            image_url: newSnap.image_url + `?t=${Date.now()}`,
            density: newSnap.density
          };
        } catch (err) {
          console.error("Failed to update snapshot:", err);
          return snap;
        }
      }));

      setSnapshots(updated);
    }, 15000);

    return () => clearInterval(interval);
  }, [snapshots]);

  const handleRemoveSnapshot = (index) => {
    const updated = [...snapshots];
    updated.splice(index, 1);
    setSnapshots(updated);
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleRemoveAll = () => {
    setSnapshots([]);
    setSelectedIndex(null);
  };

  if (snapshots.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme === 'light' ? '#ffffff' : '#2a2a2a',
      borderTop: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
      boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
      transform: open ? 'translateY(0)' : 'translateY(calc(100% - 48px))',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 1000,
      fontFamily: 'system-ui, -apple-system, Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: theme === 'light' ? '#f8f9fa' : '#333',
        borderBottom: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
        color: theme === 'light' ? '#213547' : '#e0e0e0',
        fontSize: '15px',
        fontWeight: '600'
      }}>
        <span>Danh sách camera theo dõi</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {open && (
            <button
              onClick={handleRemoveAll}
              style={{
                background: 'none',
                border: 'none',
                color: theme === 'light' ? '#dc3545' : '#ff6b6b',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'color 0.2s',
                ':hover': {
                  color: theme === 'light' ? '#c82333' : '#e65a5a'
                },
                ':focus': {
                  outline: `2px solid ${theme === 'light' ? '#007bff' : '#0056b3'}`,
                  outlineOffset: '2px'
                }
              }}
            >
              Xóa toàn bộ
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: theme === 'light' ? '#007bff' : '#0056b3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: theme === 'light' ? '#0056b3' : '#003d82'
              },
              ':focus': {
                outline: `2px solid ${theme === 'light' ? '#007bff' : '#0056b3'}`,
                outlineOffset: '2px'
              }
            }}
          >
            {open ? '▼ Thu gọn' : '▲ Mở rộng'}
          </button>
        </div>
      </div>

      {open && (
        <div style={{
          maxHeight: '400px', // Giới hạn chiều cao của panel
          overflowY: 'auto', // Bật cuộn dọc
          overflowX: 'hidden', // Tắt cuộn ngang
          padding: '16px',
          backgroundColor: theme === 'light' ? '#fafafa' : '#2a2a2a',
          scrollbarWidth: 'thin',
          scrollbarColor: theme === 'light' ? '#ccc #fafafa' : '#555 #2a2a2a'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Giữ grid nhưng giới hạn chiều cao
            gap: '16px'
          }}>
            {snapshots.map((snap, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index)}
                style={{
                  position: 'relative',
                  backgroundColor: selectedIndex === index ? (theme === 'light' ? '#e9f1ff' : '#444') : (theme === 'light' ? '#ffffff' : '#333'),
                  border: selectedIndex === index ? '2px solid #007bff' : `1px solid ${theme === 'light' ? '#e0e0e0' : '#555'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  color: theme === 'light' ? '#213547' : '#e0e0e0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  ':hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSnapshot(index);
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'transparent',
                    color: theme === 'light' ? '#dc3545' : '#ff6b6b',
                    border: 'none',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    ':hover': {
                      color: theme === 'light' ? '#c82333' : '#e65a5a'
                    },
                    ':focus': {
                      outline: `2px solid ${theme === 'light' ? '#007bff' : '#0056b3'}`,
                      outlineOffset: '2px'
                    }
                  }}
                  aria-label={`Xóa camera ${snap.name}`}
                >
                  ×
                </button>
                <p style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#aaa', margin: 0, fontWeight: '500' }}>
                  {snap.name}
                </p>
                <img
                  src={snap.image_url}
                  alt={`Snapshot of ${snap.name}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '6px',
                    objectFit: 'cover',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>
                  <strong>Mật độ:</strong> {snap.density?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import { Link } from 'react-router-dom';

export default function Header({ theme, toggleTheme }) {
  return (
    <header
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#282c34',
        padding: '10px 24px',
        color: theme === 'light' ? '#213547' : '#e0e0e0',
        fontSize: '20px',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}
    >
      <Link
        to="/"
        style={{
          color: theme === 'light' ? '#213547' : '#e0e0e0',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '22px',
          transition: 'color 0.2s'
        }}
      >
        <span style={{ fontSize: '24px' }}>🚦</span> Hệ thống dự báo giao thông
      </Link>
      <button
        onClick={toggleTheme}
        style={{
          backgroundColor: theme === 'light' ? '#007bff' : '#0056b3',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '10px 15px',
          fontSize: '15px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.2s, transform 0.2s',
          ':hover': {
            backgroundColor: theme === 'light' ? '#0056b3' : '#003d82',
            transform: 'scale(1.05)'
          }
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
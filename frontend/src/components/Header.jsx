import { Link } from 'react-router-dom';
import '../css/Header.css';

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-title">
        <Link to="/">🚦 Hệ thống dự báo giao thông</Link>
      </div>
    </header>
  );
}
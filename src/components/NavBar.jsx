// src/components/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';

function NavBar({ cartCount = 0, userName = "Người dùng" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/home" className="navbar-logo">📚 Thư viện</Link>

      <div className="navbar-center">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm sách..."
        />
      </div>

      <nav className="navbar-links">
        <Link to="/favorites">Yêu thích</Link>
      </nav>

      <div className="navbar-right">
        <span className="navbar-cart">🛒 {cartCount}</span>
        <span className="navbar-user">👤 {userName}</span>
        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </header>
  );
}

export default NavBar;

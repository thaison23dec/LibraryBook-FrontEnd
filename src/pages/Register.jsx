import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginStyle from '../assets/css/Login.module.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          role: 'CUSTOMER'
        }),
        credentials: 'include'
      });

      if (response.ok) {
        alert('Đăng ký thành công!');
        navigate('/login');
      } else {
        const result = await response.json();
        setErrorMessage(result.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      setErrorMessage('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className={LoginStyle.loginPage}>
      <div className={LoginStyle.loginContainer}>
        <h2>Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Tài khoản</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          <button type="submit">Đăng ký</button>
        </form>
        <p>
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
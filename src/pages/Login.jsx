// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/user/login', form, { withCredentials: true });
      alert(response.data.message); // hoặc lưu thông tin đăng nhập vào localStorage
      // chuyển hướng theo role:
      if (response.data.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/home';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra!');
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Tên đăng nhập" value={form.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;

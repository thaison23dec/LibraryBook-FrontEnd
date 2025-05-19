// src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({
    username: '', password: '', fullName: '', email: '', address: '', phoneNumber: '', role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/user/add', form);
      setSuccess(response.data.message);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra!');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Tên đăng nhập" value={form.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
        <input name="fullName" placeholder="Họ tên" value={form.fullName} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="address" placeholder="Địa chỉ" value={form.address} onChange={handleChange} />
        <input name="phoneNumber" placeholder="Số điện thoại" value={form.phoneNumber} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="CUSTOMER">Khách hàng</option>
          <option value="EMPLOYEE">Nhân viên</option>
        </select>
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;

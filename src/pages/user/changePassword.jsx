import React, { useEffect, useState } from 'react';
import headerStyles from '../../assets/css/header.module.css';
import changePasswordStyles from '../../assets/css/changePassword.module.css';

const ChangePassword = () => {
  const [userPassword, setUserPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('/api/user/information');
      const user = await res.json();

      if (!user || Object.keys(user).length === 0) {
        alert("Vui lòng đăng nhập!");
        window.location.href = "/signin";
      } else {
        setUserPassword(user.password);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userPassword !== currentPassword) {
      setErrorMessage("Mật khẩu không chính xác!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    setErrorMessage('');

    try {
      const res = await fetch('/api/user/changepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.ok) {
        alert("Đổi mật khẩu thành công!");
        window.location.href = "/home";
      } else {
        setErrorMessage("Lỗi khi đổi mật khẩu!");
      }
    } catch (error) {
      console.error('Lỗi gửi yêu cầu:', error);
      setErrorMessage("Lỗi hệ thống!");
    }
  };

  return (
    <div className={changePasswordStyles.pageBody}>
      {/* Header */}
      <nav className={headerStyles.navbar}>
        <ul>
          <li><a href="/home">Trang chủ</a></li>
          <li><a href="/bookCase">Tủ sách</a></li>
          <li><a href="/favoriteBook">Yêu thích</a></li>
          <li><a href="/bill">Lịch sử mượn sách</a></li>
          <li className={`${headerStyles.right} ${headerStyles.dropdown}`}>
            <a href="#">Tài khoản</a>
            <ul className={headerStyles['dropdown-menu']}>
              <li><a href="/account">Thông tin chi tiết</a></li>
              <li><a href="/bookCart">Giỏ sách</a></li>
              <li><a href="/changePassword">Đổi mật khẩu</a></li>
              <li><a href="/login">Đăng xuất</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Form đổi mật khẩu */}
      <div className={changePasswordStyles.box}>
        <h2 className={changePasswordStyles.title}>Đổi mật khẩu</h2>
        <form className={changePasswordStyles.form} onSubmit={handleSubmit}>
          <label htmlFor="current-password" className={changePasswordStyles.label}>Mật khẩu hiện tại</label>
          <input
            type="password"
            id="current-password"
            name="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={changePasswordStyles.input}
          />

          <label htmlFor="new-password" className={changePasswordStyles.label}>Mật khẩu mới</label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={changePasswordStyles.input}
          />

          <label htmlFor="confirm-password" className={changePasswordStyles.label}>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={changePasswordStyles.input}
          />

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          <button type="submit" className={changePasswordStyles.button}>Xác nhận</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

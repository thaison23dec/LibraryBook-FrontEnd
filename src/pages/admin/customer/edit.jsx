import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import headerStyle from '../../../assets/css/header.module.css';
import manageStyles from '../../../assets/css/manage.module.css';
import editStyles from '../../../assets/css/edit.module.css';

const EditCustomer = () => {
  const [user, setUser] = useState({
    username: '',
    password: '123456',
    role: 'CUSTOMER',
    fullName: '',
    phoneNumber: '',
    email: '',
    address: ''
  });

  const location = useLocation();
  const navigate = useNavigate();

  const userId = new URLSearchParams(location.search).get('userId');
  const isEditMode = Boolean(userId);

  useEffect(() => {
    if (isEditMode) {
      fetch(`/api/user/${userId}`)
        .then(res => {
          if (!res.ok) throw new Error('Không tìm thấy người dùng!');
          return res.json();
        })
        .then(data => {
          setUser(prev => ({
            ...prev,
            username: data.username,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            address: data.address
          }));
        })
        .catch(err => alert(err.message));
    }
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = isEditMode ? '/api/user/update' : '/api/user/add';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Cập nhật thành công!');
      navigate('/listCustomer');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className={headerStyle.navbar}>
        <ul>
          <li><a href="#">Trang quản trị</a></li>
          <li className={`${headerStyle.right} ${headerStyle.dropdown}`}>
            <a href="#">Tài khoản</a>
            <ul className={headerStyle["dropdown-menu"]}>
              <li><a href="adminProfile">Thông tin chi tiết</a></li>
              <li><a href="/adminChangePassword">Đổi mật khẩu</a></li>
              <li><a href="/login">Đăng xuất</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Container: sidebar + form */}
      <div className={editStyles.container}>
        {/* Sidebar */}
        <div className={manageStyles.sidebar}>
          <a href="listCustomer">Quản lý khách hàng</a>
          <a href="listEmployee">Quản lý nhân viên</a>
          <a href="editCategory">Quản lý thể loại</a>
          <a href="listBook">Quản lý sách</a>
          <a href="listRental">Quản lý thuê sách</a>
          <a href="listInvoice">Hóa đơn</a>
        </div>

        {/* Form Box */}
        <div className={editStyles.formBox}>
          <div className={editStyles.title}>
            {isEditMode ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="username">Tên đăng nhập</label>
              <input
                className={editStyles.input}
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                disabled={isEditMode}
              />
            </div>

            <input type="hidden" name="password" value="123456" />
            <input type="hidden" name="role" value="CUSTOMER" />

            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="fullName">Họ và tên</label>
              <input
                className={editStyles.input}
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
              />
            </div>

            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="phoneNumber">Số điện thoại</label>
              <input
                className={editStyles.input}
                type="text"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="email">Email</label>
              <input
                className={editStyles.input}
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>

            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="address">Địa chỉ</label>
              <input
                className={editStyles.input}
                type="text"
                name="address"
                value={user.address}
                onChange={handleChange}
              />
            </div>

            <div className={editStyles.btnGroup}>
              <button
                type="button"
                className={`${editStyles.btn} ${editStyles.btnAdd}`}
                onClick={handleSubmit}
              >
                {isEditMode ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
              </button>
              <button
                type="button"
                className={`${editStyles.btn} ${editStyles.btnDanger}`}
                onClick={() => navigate('/listCustomer')}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;

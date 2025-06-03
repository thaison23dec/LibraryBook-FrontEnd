import React, { useEffect, useState, useRef } from 'react';
import headerStyles from '../../assets/css/header.module.css';
import accountStyles from '../../assets/css/account.module.css';

const Account = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const imageInputRef = useRef(null);

  useEffect(() => {
    fetch('/api/user/information', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length === 0) {
          alert('Bạn chưa đăng nhập!');
          window.location.href = '/signin';
        } else {
          setUser(data);
          setFormData({
            username: data.username || '',
            fullName: data.fullName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || ''
          });
          setAvatarPreview(`http://localhost:8080${data.imageUrl}` || '/picture/avatar.jpg');
        }
      })
      .catch(() => alert('Lỗi tải thông tin người dùng!'));
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarClick = () => {
    imageInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    if (imageInputRef.current.files[0]) {
      form.append('image', imageInputRef.current.files[0]);

      const res = await fetch('/api/user/update-avatar', {
        method: 'POST',
        body: form
      });

      if (res.ok) {
        const result = await res.json();
        setAvatarPreview(`http://localhost:8080${result.imageUrl}` || avatarPreview);
        alert('Cập nhật ảnh thành công!');
      } else {
        alert('Lỗi khi cập nhật ảnh!');
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user/setprofile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert('Cập nhật thông tin thành công!');
    } else {
      const errorText = await res.text();
      alert(errorText || 'Cập nhật thất bại! Kiểm tra lại thông tin.');
    }
  };

  return (
    <>
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
              <li><a href="/bookCart">Giỏ hàng</a></li>
              <li><a href="/changePassword">Đổi mật khẩu</a></li>
              <li><a href="/login">Đăng xuất</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <div className={accountStyles['profile-container']}>
        <div className={accountStyles['profile-card']}>
          <form id="avatarForm" encType="multipart/form-data">
            <div className={accountStyles['form-group']}>
              <img
                className={accountStyles.avatar}
                src={avatarPreview}
                alt="Avatar"
                onClick={handleAvatarClick}
                style={{ cursor: 'pointer' }}
              />
              <input
                type="file"
                name="image"
                id="imageInput"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </div>
            <button type="button" className={`${accountStyles.btn} ${accountStyles['btn-add']}`} onClick={handleAvatarUpdate}>
              Cập nhật ảnh
            </button>
          </form>

          <div className={accountStyles['info-container']}>
            <div className={accountStyles.info}>
              <p><strong>Tài khoản: </strong> <input type="text" name="username" value={formData.username} readOnly /></p>
              <p><strong>Họ và tên: </strong> <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} /></p>
              <p><strong>Email: </strong> <input type="text" name="email" value={formData.email} onChange={handleInputChange} /></p>
              <p><strong>Số điện thoại: </strong> <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} /></p>
              <p><strong>Địa chỉ: </strong> <input type="text" name="address" value={formData.address} onChange={handleInputChange} /></p>
            </div>
            <div className={accountStyles['button-group']}>
              <button className={accountStyles.btn} onClick={handleUpdateUser}>Cập nhật thông tin</button>
              <a href="/change_password" className={accountStyles.btn}>Đổi mật khẩu</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import editStyles from "../../../assets/css/edit.module.css";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const userId = new URLSearchParams(search).get("userId");

  const [formData, setFormData] = useState({
    username: "",
    password: "123456",
    role: "EMPLOYEE",
    fullName: "",
    phoneNumber: "",
    email: "",
    address: ""
  });

  const isEditMode = Boolean(userId);

  useEffect(() => {
    if (isEditMode) {
      axios.get(`/api/user/${userId}`)
        .then(({ data }) => {
          setFormData({
            ...formData,
            username: data.username,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            address: data.address,
            password: "123456",
            role: "EMPLOYEE"
          });
        })
        .catch(() => alert("Không tìm thấy người dùng!"));
    }
    // eslint-disable-next-line
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const apiUrl = isEditMode ? "/api/user/update" : "/api/user/add";
    axios.post(apiUrl, formData)
      .then(() => {
        alert("Cập nhật thành công!");
        navigate("/listEmployee");
      })
      .catch(err => alert("Lỗi: " + err.response?.data || err.message));
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

      {/* Body container */}
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

        {/* Form */}
        <div className={editStyles.formBox}>
          <div className={editStyles.title}>
            {isEditMode ? "Cập nhật nhân viên" : "Thêm nhân viên"}
          </div>
          <form>
            <div className={editStyles.formGroup}>
              <label className={editStyles.label}>Tài khoản</label>
              <input
                className={editStyles.input}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                readOnly={isEditMode}
              />
            </div>

            {!isEditMode && (
              <input type="hidden" name="password" value="123456" />
            )}
            <input type="hidden" name="role" value="EMPLOYEE" />

            <div className={editStyles.formGroup}>
              <label className={editStyles.label}>Họ và tên</label>
              <input
                className={editStyles.input}
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className={editStyles.formGroup}>
              <label className={editStyles.label}>Số điện thoại</label>
              <input
                className={editStyles.input}
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className={editStyles.formGroup}>
              <label className={editStyles.label}>Email</label>
              <input
                className={editStyles.input}
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={editStyles.formGroup}>
              <label className={editStyles.label}>Địa chỉ</label>
              <input
                className={editStyles.input}
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className={editStyles.btnGroup}>
              <button
                type="button"
                className={`${editStyles.btn} ${editStyles.btnAdd}`}
                onClick={handleSubmit}
              >
                {isEditMode ? "Cập nhật nhân viên" : "Thêm nhân viên"}
              </button>
              <a
                href="/listEmployee"
                className={`${editStyles.btn} ${editStyles.btnDanger}`}
              >
                Hủy
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;

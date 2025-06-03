import React, { useEffect, useState } from "react";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import editStyles from "../../../assets/css/edit.module.css";

export default function AdminProfile() {
  const [user, setUser] = useState({
    username: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadInformation();
  }, []);

  const loadInformation = () => {
    fetch("/api/user/information", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi tải thông tin người dùng");
        return res.json();
      })
      .then((userData) => {
        if (!userData || Object.keys(userData).length === 0) {
          alert("Bạn chưa đăng nhập!");
          window.location.href = "/signin";
          return;
        }
        setUser({
          username: userData.username || "",
          fullName: userData.fullName || "",
          phoneNumber: userData.phoneNumber || "",
          email: userData.email || "",
          address: userData.address || "",
          imageUrl: userData.imageUrl || "/khac/logo.webp",
        });
      })
      .catch(() => {
        alert("Lỗi tải thông tin người dùng!");
      });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const { username, fullName, phoneNumber, email, address } = user;
    const userData = { username, fullName, phoneNumber, email, address };

    fetch("/api/user/setprofile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    })
      .then((res) => {
        if (!res.ok)
          return res
            .text()
            .then((text) => {
              throw new Error(text || "Cập nhật thất bại!");
            });
        return res.json();
      })
      .then((response) => {
        alert("Cập nhật thông tin thành công!");
        loadInformation();
        console.log("Server response:", response);
      })
      .catch((error) => {
        console.error("Lỗi cập nhật:", error.message);
        alert(error.message);
        loadInformation();
      });
  };

  return (
    <>
      {/* Header */}
      <nav className={headerStyle.navbar}>
        <ul>
          <li>
            <a href="#">Trang quản trị</a>
          </li>
          <li className={`${headerStyle.right} ${headerStyle.dropdown}`}>
            <a href="#">Tài khoản</a>
            <ul className={headerStyle["dropdown-menu"]}>
              <li>
                <a href="adminProfile">Thông tin chi tiết</a>
              </li>
              <li>
                <a href="/adminChangePassword">Đổi mật khẩu</a>
              </li>
              <li>
                <a href="/login">Đăng xuất</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div className={manageStyles.container}>
        <div className={manageStyles.sidebar}>
          <a href="listCustomer">Quản lý khách hàng</a>
          <a href="listEmployee">Quản lý nhân viên</a>
          <a href="editCategory">Quản lý thể loại</a>
          <a href="listBook">Quản lý sách</a>
          <a href="listRental">Quản lý thuê sách</a>
          <a href="listInvoice">Hóa đơn</a>
        </div>

        <form className={editStyles.formBox} onSubmit={handleUpdate}>
          <div className={editStyles.title}>Thông tin tài khoản</div>

          <div className={editStyles.formGroup}>
            <label htmlFor="username" className={editStyles.label}>
              Tài khoản
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className={editStyles.input}
              value={user.username}
              readOnly
            />
          </div>

          <div className={editStyles.formGroup}>
            <label htmlFor="fullName" className={editStyles.label}>
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className={editStyles.input}
              value={user.fullName}
              onChange={handleChange}
            />
          </div>

          <div className={editStyles.formGroup}>
            <label htmlFor="phoneNumber" className={editStyles.label}>
              Số điện thoại
            </label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              className={editStyles.input}
              value={user.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className={editStyles.formGroup}>
            <label htmlFor="email" className={editStyles.label}>
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className={editStyles.input}
              value={user.email}
              onChange={handleChange}
            />
          </div>

          <div className={editStyles.formGroup}>
            <label htmlFor="address" className={editStyles.label}>
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              id="address"
              className={editStyles.input}
              value={user.address}
              onChange={handleChange}
            />
          </div>

          <div className={editStyles.btnGroup}>
            <button
              type="submit"
              className={`${editStyles.btn} ${editStyles.btnAdd}`}
            >
              Cập nhật thông tin
            </button>
            <a
              href="adminChangePassword"
              className={`${editStyles.btn} ${editStyles.btnAdd}`}
            >
              Đổi mật khẩu
            </a>
          </div>
        </form>
      </div>
    </>
  );
}

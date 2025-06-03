import React, { useEffect, useState } from "react";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import editStyles from "../../../assets/css/edit.module.css";

export default function AdminChangePassword() {
  const [userPassword, setUserPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Lấy thông tin user khi component mount
    fetch("/api/user/information")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy thông tin user");
        return res.json();
      })
      .then((user) => {
        if (!user || Object.keys(user).length === 0) {
          alert("Vui lòng đăng nhập!");
          window.location.href = "/login";
          return;
        }
        setUserPassword(user.password);
      })
      .catch(() => {
        alert("Vui lòng đăng nhập!");
        window.location.href = "/login";
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userPassword !== currentPassword) {
      setErrorMessage("Mật khẩu không chính xác!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp!");
      return;
    }
    setErrorMessage("");

    fetch("/api/user/changepassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi đổi mật khẩu");
        return res.json();
      })
      .then(() => {
        alert("Đổi mật khẩu thành công!");
        window.location.href = "/adminProfile";
      })
      .catch(() => {
        setErrorMessage("Lỗi");
      });
  };

  return (
    <>
      {/* Header navigation */}
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

      <div className={manageStyles.container}>
        <div className={manageStyles.sidebar}>
          <a href="listCustomer">Quản lý khách hàng</a>
          <a href="listEmployee">Quản lý nhân viên</a>
          <a href="editCategory">Quản lý thể loại</a>
          <a href="listBook">Quản lý sách</a>
          <a href="listRental">Quản lý thuê sách</a>
          <a href="listInvoice">Hóa đơn</a>
        </div>

        <form className={editStyles.formBox} onSubmit={handleSubmit}>
          <div className={editStyles.title}>Đổi mật khẩu</div>

          <input type="hidden" value={userPassword} readOnly />

          <div className={editStyles.formGroup}>
            <label className={editStyles.label} htmlFor="current-password">Mật khẩu hiện tại</label>
            <input
              className={editStyles.input}
              type="password"
              id="current-password"
              name="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className={editStyles.formGroup}>
            <label className={editStyles.label} htmlFor="new-password">Mật khẩu mới</label>
            <input
              className={editStyles.input}
              type="password"
              id="new-password"
              name="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className={editStyles.formGroup}>
            <label className={editStyles.label} htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
            <input
              className={editStyles.input}
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p style={{ color: "red" }}>{errorMessage}</p>
          )}

          <div className={editStyles.btnGroup}>
            <button type="submit" className={`${editStyles.btn} ${editStyles.btnAdd}`}>
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

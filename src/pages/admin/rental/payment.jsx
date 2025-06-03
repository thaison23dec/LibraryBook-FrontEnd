import React, { useEffect, useState } from "react";
import axios from "axios";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import editStyles from "../../../assets/css/edit.module.css";
import paymentStyles from "../../../assets/css/payment.module.css";

const PaymentRental = () => {
  const [customerId, setCustomerId] = useState(null);
  const [customer, setCustomer] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("customerId");
    setCustomerId(id);
  }, []);

  useEffect(() => {
    if (customerId) {
      axios
        .get(`/api/user/${customerId}`)
        .then((res) => setCustomer(res.data))
        .catch((err) => console.error("Lỗi khi lấy thông tin khách hàng:", err));
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) {
      axios
        .get(`/api/payment/temp/detail/${customerId}`)
        .then((res) => {
          setPaymentDetails(res.data);
          const total = res.data.reduce((sum, item) => sum + item.total, 0);
          setTotalAmount(total);
        })
        .catch((err) => console.error("Lỗi khi lấy dữ liệu thanh toán tạm:", err));
    }
  }, [customerId]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const toISODate = (vnDateStr) => {
    const parts = vnDateStr.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month}-${day}T00:00:00`;
  };

  const handlePayment = () => {
    const paymentItems = paymentDetails.map((item) => ({
      book: { id: item.book.id },
      bookLoanDate: toISODate(formatDateTime(item.bookLoanDate)),
      dueDate: toISODate(formatDateTime(item.dueDate)),
      punishCost: item.punishCost || 0,
      reason: item.reason,
      quantity: item.quantity,
    }));

    axios
      .post(`/api/payment/add/${customerId}`, paymentItems)
      .then(() => {
        alert("Thanh toán thành công!");
        window.location.href = "/listInvoice";
      })
      .catch((err) => {
        alert("Đã xảy ra lỗi khi thanh toán: " + (err.response?.data || err.message));
      });
  };

  const goBack = () => {
    if (document.referrer) {
      window.location.href = document.referrer;
    } else {
      window.location.href = "/home";
    }
  };

  return (
    <>
      <nav className={headerStyle.navbar}>
        <ul>
          <li><a href="#">Trang quản trị</a></li>
          <li className={`${headerStyle.right} ${headerStyle.dropdown}`}>
            <a href="#">Tài khoản</a>
            <ul className={headerStyle['dropdown-menu']}>
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

        <div className={manageStyles.content}>
          <button className={editStyles.btn} onClick={goBack}>Back</button>

          <div className={editStyles.formBox}>
            <div className={editStyles.title}>Thông tin khách hàng</div>
            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="fullName">Họ và tên</label>
              <input
                id="fullName"
                type="text"
                className={editStyles.input}
                value={customer.fullName}
                readOnly
              />
            </div>
            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="text"
                className={editStyles.input}
                value={customer.phoneNumber}
                readOnly
              />
            </div>
            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                className={editStyles.input}
                value={customer.email}
                readOnly
              />
            </div>
            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="address">Địa chỉ</label>
              <input
                id="address"
                type="text"
                className={editStyles.input}
                value={customer.address}
                readOnly
              />
            </div>
          </div>

          <div className={paymentStyles.tableWrapper}>
            <h2 className={editStyles.title}>Chi tiết thanh toán</h2>
            <div className={paymentStyles.tableScroll}>
              <table className={editStyles.categoryTable}>
                <thead>
                  <tr>
                    <th>Mã sách</th>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Số lượng</th>
                    <th>Ngày mượn</th>
                    <th>Hạn</th>
                    <th>Tiền phạt</th>
                    <th>Lý do</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentDetails.map((item, index) => (
                    <tr key={index}>
                      <td>{item.book.id}</td>
                      <td>{item.book.bookName}</td>
                      <td>{item.book.author}</td>
                      <td>{item.quantity}</td>
                      <td>{formatDateTime(item.bookLoanDate)}</td>
                      <td>{formatDateTime(item.dueDate)}</td>
                      <td>{item.punishCost}</td>
                      <td>{item.reason}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={editStyles.btnGroup}>
              <h3>Thành tiền: {totalAmount} vnđ.</h3>
              <button
                className={`${editStyles.btn} ${editStyles.btnAdd}`}
                onClick={handlePayment}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentRental;
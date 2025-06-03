import React, { useEffect, useState } from "react";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import billStyles from "../../../assets/css/bill.module.css";
import billDetailStyles from "../../../assets/css/billDetail.module.css";

const InvoiceDetail = () => {
  const [billData, setBillData] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("id");

    if (!paymentId) {
      alert("Không tìm thấy mã hóa đơn!");
      window.location.href = "/list";
      return;
    }

    fetch(`/api/payment/detail/${paymentId}`)
      .then((res) => res.json())
      .then((data) => {
        setBillData(data);
        calculateTotal(data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải chi tiết hóa đơn:", error);
        alert("Không thể tải chi tiết hóa đơn!");
      });
  }, []);

  const calculateTotal = (data) => {
    if (!Array.isArray(data.paymentDetails)) return;
    const totalAmount = data.paymentDetails.reduce((acc, detail) => {
      return acc + detail.quantity * 10000 + detail.punishCost;
    }, 0);
    setTotal(totalAmount);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
        {/* Header */}
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

      {/* Sidebar + Content */}
      <div className={manageStyles.container}>
        <div className={manageStyles.sidebar}>
            <a href="listCustomer">Quản lý khách hàng</a>
            <a href="listEmployee">Quản lý nhân viên</a>
            <a href="editCategory">Quản lý thể loại</a>
            <a href="listBook">Quản lý sách</a>
            <a href="listRental">Quản lý thuê sách</a>
            <a href="listInvoice">Hóa đơn</a>
        </div>

        <div className={billDetailStyles.content} style={{ marginLeft: "25%" }}>
          <h2>Chi Tiết Hóa Đơn</h2>

          <div className={billDetailStyles["info-box"]}>
            <div className={billDetailStyles["info-bottom"]}>
              <p><strong>Thư viện LibraryBook</strong></p>
              <p><strong>Số điện thoại: 0988265438</strong></p>
              <p><strong>Email: librarybook@gmail.com</strong></p>
            </div>
            <p><strong>Nhân viên:</strong> {billData?.employee_user?.username}</p>
            <p><strong>Khách hàng:</strong> {billData?.customer_user?.username}</p>
            <p><strong>Email:</strong> {billData?.customer_user?.email}</p>
          </div>

          <table className={billDetailStyles["book-list"]}>
            <thead>
              <tr>
                <th></th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Số lượng</th>
                <th>Tiền mượn</th>
                <th>Tiền phạt</th>
                <th>Lý do</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {billData?.paymentDetails?.length > 0 ? (
                billData.paymentDetails.map((detail, index) => {
                  const amount = detail.quantity * 10000 + detail.punishCost;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{detail.book.bookName}</td>
                      <td>{detail.book.author}</td>
                      <td>{detail.quantity}</td>
                      <td>{detail.quantity * 10000}</td>
                      <td>{detail.punishCost}</td>
                      <td>{detail.reason}</td>
                      <td>{amount}</td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="8">Không có sách nào.</td></tr>
              )}
            </tbody>
          </table>

          <div className={billDetailStyles["info-bottom"]}>
            <p>Thành tiền: <span>{total}</span> vnđ</p>
            <p>Thời gian: <span>{billData ? formatDateTime(billData.time) : ""}</span></p>
          </div>

          <div className={billDetailStyles.but}>
            <a href="/listInvoice" className={billDetailStyles["btn-back"]}>Quay lại danh sách hóa đơn</a>
            <button onClick={handlePrint} className={billDetailStyles["btn-print"]}>In hóa đơn</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
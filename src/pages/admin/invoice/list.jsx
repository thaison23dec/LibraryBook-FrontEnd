import React, { useEffect, useState } from "react";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import billStyles from "../../../assets/css/bill.module.css";
import searchBoxStyles from "../../../assets/css/searchBox.module.css";
import axios from "axios";

const ListInvoice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    customerFullName: "",
    customerPhoneNumber: "",
    employeeFullName: "",
  });

  const fetchInvoices = async (page = 1) => {
    try {
      const { data } = await axios.get("/api/payment/search", {
        params: { ...filters, pageSize: 10, page },
      });
      setInvoices(data.invoiceResponseDTOs || []);
      setTotalPages(data.totalPages);
    } catch (error) {
      alert("Lỗi khi tải danh sách hóa đơn.");
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchInvoices(1);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderPagination = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    if (currentPage <= 3) end = Math.min(5, totalPages);
    if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4);

    pages.push(
      <button
        key="prev"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        &laquo;
      </button>
    );

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={i === currentPage ? manageStyles.active : ""}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        &raquo;
      </button>
    );

    return pages;
  };

  return (
    <>
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
          <h2>Tìm kiếm hoá đơn</h2>

          <div className={searchBoxStyles.searchContainer}>
            <div className={searchBoxStyles.searchBox}>
              <input
                type="text"
                placeholder="Tên khách hàng"
                value={filters.customerFullName}
                onChange={(e) =>
                  setFilters({ ...filters, customerFullName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Số điện thoại khách hàng"
                value={filters.customerPhoneNumber}
                onChange={(e) =>
                  setFilters({ ...filters, customerPhoneNumber: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Tên nhân viên"
                value={filters.employeeFullName}
                onChange={(e) =>
                  setFilters({ ...filters, employeeFullName: e.target.value })
                }
              />
            </div>
            <button className={manageStyles.btn} onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>

          <table className={billStyles["bill-table"]}>
            <thead>
              <tr>
                <th>Mã hóa đơn</th>
                <th>Khách hàng</th>
                <th>Nhân viên</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="4">Không có hóa đơn nào.</td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.paymentId}
                    className={billStyles["bill-row"]}
                    onClick={() =>
                      (window.location.href =
                        "/invoiceDetail?id=" + invoice.paymentId)
                    }
                  >
                    <td>{invoice.paymentId}</td>
                    <td>{invoice.customer_user.fullName}</td>
                    <td>{invoice.employee_user.fullName}</td>
                    <td>{formatDate(invoice.time)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div id="pagination" className={manageStyles.pagination}>
            {renderPagination()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListInvoice;

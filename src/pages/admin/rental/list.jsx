import React, { useState, useEffect } from "react";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import searchBoxStyle from "../../../assets/css/searchBox.module.css";

function ListRental() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchFullName, setSearchFullName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  function loadUsers() {
    let params = new URLSearchParams({
      pageSize: 10,
      page: currentPage,
    });

    if (searchFullName) params.append("fullName", searchFullName);
    if (searchPhone) params.append("phoneNumber", searchPhone);
    if (searchEmail) params.append("email", searchEmail);

    fetch("/api/borrow/borrowing/customer/list?" + params.toString())
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách khách hàng:", err);
      });
  }

  function handleSearch() {
    setCurrentPage(1);
    loadUsers();
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  function renderPagination() {
    const buttons = [];

    buttons.push(
      <button
        key="prev"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        &laquo;
      </button>
    );

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={i === currentPage ? manageStyles.active : ""}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        &raquo;
      </button>
    );

    return buttons;
  }

  return (
    <>
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
          <h2>Tìm kiếm khách hàng</h2>
          <div className={searchBoxStyle.searchContainer}>
            <div className={searchBoxStyle.searchBox}>
              <input
                type="text"
                placeholder="Họ và tên"
                value={searchFullName}
                onChange={(e) => setSearchFullName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
            <button
              className={`${manageStyles.btn} ${searchBoxStyle.btn || ""}`}
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>

          <h2>Bảng danh sách khách hàng đang mượn sách</h2>
          <table className={manageStyles.table}>
            <thead>
              <tr>
                <th>Mã khách hàng</th>
                <th>Tài khoản</th>
                <th>Tên khách hàng</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                    <td className={manageStyles.actions}>
                      <a href={`rentalDetail?customerId=${user.id}`}>
                        <img src="/picture/info.png" alt="Chi tiết" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có khách hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className={manageStyles.pagination}>
            {renderPagination()}
          </div>
        </div>
      </div>
    </>
  );
}

export default ListRental;

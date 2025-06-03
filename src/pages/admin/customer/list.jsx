import React, { useEffect, useState } from "react";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import searchBoxStyle from "../../../assets/css/searchBox.module.css";

const AccountManagement = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    pageSize: 10,
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const buildQueryParams = (params) => {
    return new URLSearchParams(params).toString();
  };

  const loadUsers = async () => {
    try {
      const query = buildQueryParams({ role: "CUSTOMER", ...filters });
      const response = await fetch(`/api/user/search?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFilters({ ...filters, [id]: value, page: 1 }); // reset page về 1 khi tìm kiếm mới
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const deleteUser = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản id = ${id} ?`)) return;

    try {
      const response = await fetch(`/api/user/delete/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Xóa thất bại với mã lỗi: ${response.status}`);
      }
      loadUsers();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
    }
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
          <h2>Tìm kiếm khách hàng</h2>
          <div className={searchBoxStyle.searchContainer}>
            <div className={searchBoxStyle.searchBox}>
              <input
                type="text"
                id="fullName"
                placeholder="Họ và tên"
                onChange={handleInputChange}
              />
              <input
                type="text"
                id="phoneNumber"
                placeholder="Số điện thoại"
                onChange={handleInputChange}
              />
              <input
                type="text"
                id="email"
                placeholder="Email"
                onChange={handleInputChange}
              />
            </div>
            <div className={searchBoxStyle.paginationControl}>
              <label htmlFor="pageSize">Kích thước trang:</label>
              <select
                id="pageSize"
                value={filters.pageSize}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    pageSize: parseInt(e.target.value),
                    page: 1,
                  })
                }
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button
              className={manageStyles.btn}
              onClick={() => setFilters({ ...filters, page: 1 })}
            >
              Tìm kiếm
            </button>
          </div>

          <div className={manageStyles.info}>
            <h2>Bảng danh sách tài khoản</h2>
            <a href="editCustomer" className={manageStyles.btn}>
              Thêm khách hàng
            </a>
          </div>

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
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6">Không có tài khoản nào được tìm thấy!</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                    <td className={manageStyles.actions}>
                      <a href={`editCustomer?userId=${user.id}`}>
                        <img src="/picture/pencil-icon.png" alt="Sửa" />
                      </a>
                      <img
                        src="/picture/delete.png"
                        alt="Xóa"
                        onClick={() => deleteUser(user.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div id="pagination" className={manageStyles.pagination}>
            <button
              disabled={filters.page <= 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              &laquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (i) =>
                  i === 1 ||
                  i === totalPages ||
                  (i >= filters.page - 2 && i <= filters.page + 2)
              )
              .map((i) => (
                <button
                  key={i}
                  className={i === filters.page ? manageStyles.active : ""}
                  onClick={() => handlePageChange(i)}
                >
                  {i}
                </button>
              ))}
            <button
              disabled={filters.page >= totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountManagement;

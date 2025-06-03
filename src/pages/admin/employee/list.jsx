import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import headerStyle from '../../../assets/css/header.module.css';
import manageStyles from '../../../assets/css/manage.module.css';
import searchBoxStyle from '../../../assets/css/searchBox.module.css';
import axios from 'axios';

const ListEmployee = () => {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    pageSize: 10,
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadUsers = async () => {
    try {
      const params = {
        role: 'EMPLOYEE',
        page: searchParams.page,
        pageSize: searchParams.pageSize,
        fullName: searchParams.fullName,
        phoneNumber: searchParams.phoneNumber,
        email: searchParams.email,
      };

      const res = await axios.get('/api/user/search', {
        params,
        withCredentials: true,
      });

      setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      if (error.response) {
        console.error('API phản hồi lỗi:', error.response.status, error.response.data);
      } else {
        console.error('Lỗi khi gọi API:', error.message);
      }
      setUsers([]);
      setTotalPages(1);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSearch = () => {
    setSearchParams(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (page) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const deleteUser = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhân viên id = ${id} ?`)) return;
    try {
      await axios.post(`/api/user/delete/${id}`);
      loadUsers();
    } catch (error) {
      console.error('Lỗi khi xóa tài khoản:', error);
    }
  };

  const renderPagination = () => {
    const { page } = searchParams;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (page <= 3) endPage = Math.min(5, totalPages);
    if (page >= totalPages - 2) startPage = Math.max(1, totalPages - 4);

    const pages = [];

    pages.push(
      <button
        key="prev"
        disabled={page <= 1}
        className={manageStyles.pageButton}
        onClick={() => goToPage(page - 1)}
      >
        &laquo;
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${manageStyles.pageButton} ${i === page ? manageStyles.active : ''}`}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        disabled={page >= totalPages}
        className={manageStyles.pageButton}
        onClick={() => goToPage(page + 1)}
      >
        &raquo;
      </button>
    );

    return <div className={manageStyles.pagination}>{pages}</div>;
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
          <h2>Tìm kiếm nhân viên</h2>
          <div className={searchBoxStyle.searchContainer}>
            <div className={searchBoxStyle.searchBox}>
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={searchParams.fullName}
                onChange={handleSearchChange}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Số điện thoại"
                value={searchParams.phoneNumber}
                onChange={handleSearchChange}
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={searchParams.email}
                onChange={handleSearchChange}
              />
            </div>
            <div className={searchBoxStyle.paginationControl}>
              <label htmlFor="pageSize">Kích thước trang:</label>
              <select
                name="pageSize"
                value={searchParams.pageSize}
                onChange={handleSearchChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button
              className={manageStyles.btn}
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>

          <div className={manageStyles.info}>
            <h2>Bảng danh sách tài khoản</h2>
            <a href="editEmployee" className={manageStyles.btn}>
              Thêm nhân viên
            </a>
          </div>

          <table className={manageStyles.table}>
            <thead>
              <tr>
                <th>Mã nhân viên</th>
                <th>Tài khoản</th>
                <th>Tên nhân viên</th>
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
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                    <td className={manageStyles.actions}>
                      <a href={`editEmployee?userId=${user.id}`} title="Sửa">
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

          {renderPagination()}
        </div>
      </div>
    </>
  );
};

export default ListEmployee;

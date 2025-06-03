import React, { useEffect, useState } from 'react';
import headerStyles from '../../assets/css/header.module.css';
import billStyles from '../../assets/css/bill.module.css';
import historyStyles from '../../assets/css/history.module.css';

const UnpaidBills = () => {
  const [bills, setBills] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
      
    useEffect(() => {
        fetch("http://localhost:8080/api/user", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    }, []);

  useEffect(() => {
    fetchBillList(page);
  }, [page]);

  const fetchBillList = async (currentPage) => {
    try {
      const response = await fetch(`/api/borrow/borrowing/list?pageSize=10&page=${currentPage}`);
      const data = await response.json();
      setBills(data.borrowings || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hóa đơn:", error);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    const pages = [];

    if (page > 1) {
      pages.push(
        <button key="prev" onClick={() => setPage(page - 1)} disabled={page <= 1}>&laquo;</button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={i === page ? historyStyles.active : ''}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }

    if (page < totalPages) {
      pages.push(
        <button key="next" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>&raquo;</button>
      );
    }

    return <div className={historyStyles.pagination}>{pages}</div>;
  };

  return (
    <div>
      {/* Header / Navbar */}
      <nav className={headerStyles.navbar}>
        <ul>
          <li><a href="/home">Trang chủ</a></li>
          <li><a href="/bookCase">Tủ sách</a></li>
          <li><a href="/favoriteBook">Yêu thích</a></li>
          <li><a href="/bill">Lịch sử mượn sách</a></li>
          <li className={`${headerStyles.right} ${headerStyles.dropdown}`}>
              {user ? (
              <>
                  <a href="#">Tài khoản</a>
                  <ul className={headerStyles['dropdown-menu']}>
                  <li><a href="/account">Thông tin chi tiết</a></li>
                  <li><a href="/bookCart">Giỏ sách</a></li>
                  <li><a href="/changePassword">Đổi mật khẩu</a></li>
                  <li><a href="/login">Đăng xuất</a></li>
                  </ul>
              </>
              ) : (
              <>
                  <a href="/login">Đăng nhập</a> | <a href="/register">Đăng ký</a>
              </>
              )}
          </li>
          </ul>
      </nav>

      {/* Main Container */}
      <div className={billStyles.container}>
        <div className={billStyles.box}>
          <div className={historyStyles['status-container']}>
            <a className={`${historyStyles.status} ${historyStyles.active}`} href="/bill">Hóa đơn</a>
            <a className={historyStyles.status} href="/borrowing">Sách đang mượn</a>
            <a className={historyStyles.status} href="/borrowed">Sách đã mượn</a>
          </div>
        </div>

        {/* Bảng hóa đơn */}
        <table className={billStyles['bill-table']}>
          <thead>
            <tr>
              <th>Mã hóa đơn</th>
              <th>Khách hàng</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {bills.length > 0 ? (
              bills.map((bill) => (
                <tr key={bill.id} className={billStyles['bill-row']} onClick={() => window.location.href = `/bill_detail?id=${bill.id}`}>
                  <td>{bill.id}</td>
                  <td>{user?.username}</td>
                  <td>{formatDateTime(bill.borrowDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Không có hóa đơn nào.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default UnpaidBills;

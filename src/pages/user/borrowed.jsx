import React, { useEffect, useState } from 'react';
import headerStyles from '../../assets/css/header.module.css';
import bookCaseStyles from '../../assets/css/bookCase.module.css';
import historyStyles from '../../assets/css/history.module.css';
import billStyles from '../../assets/css/bill.module.css';

function BorrowedHistory() {
    const [bookBorroweds, setBookBorroweds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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
    loadBooks(currentPage);
  }, [currentPage]);

  const loadBooks = async (page) => {
    try {
      const response = await fetch(`/api/borrow/borrowed/book/list?pageSize=10&page=${page}`);
      if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');

      const data = await response.json();
      setBookBorroweds(data.bookBorroweds || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      alert('Không thể tải dữ liệu sách');
      console.error(err);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const buttons = [];

    buttons.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
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
          className={i === currentPage ? historyStyles.active : ''}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        &raquo;
      </button>
    );

    return buttons;
  };

  return (
    <>
      {/* Header */}
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
                  <li><a href="/bookCart">Giỏ hàng</a></li>
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

      {/* Lịch sử mượn */}
      <div className={billStyles.container}>
        <div className={billStyles.box}>
          <div className={historyStyles['status-container']}>
            <a className={historyStyles.status} href="/bill">Hóa đơn</a>
            <a className={historyStyles.status} href="/borrowing">Sách đang mượn</a>
            <a className={`${historyStyles.status} ${historyStyles.active}`} href="/borrowed">Sách đã mượn</a>
          </div>
        </div>

        <div className={bookCaseStyles['book-list']}>
          {bookBorroweds.length === 0 ? (
            <p>Không có sách đã mượn</p>
          ) : (
            bookBorroweds.map((book) => (
              <a key={book.id} href={`/bookDetail?bookId=${book.id}`}>
                <div className={bookCaseStyles.book}>
                  <img src={`http://localhost:8080${book.imageUrl}`} alt={book.bookName} />
                  <p>{book.bookName}</p>
                </div>
              </a>
            ))
          )}
        </div>

        <div className={historyStyles.pagination}>
          {renderPagination()}
        </div>
      </div>
    </>
  );
}

export default BorrowedHistory;

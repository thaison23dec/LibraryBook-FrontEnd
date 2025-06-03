import React, { useEffect, useState } from 'react';
import headerStyles from '../../assets/css/header.module.css';
import bookCartStyles from '../../assets/css/bookCart.module.css';
import billStyles from '../../assets/css/bill.module.css';
import historyStyles from '../../assets/css/history.module.css';

const BorrowingBooks = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`/api/borrow/borrowing/book/list?pageSize=10&page=${currentPage}`);
      const data = await res.json();
      setBooks(data.bookBorrowings || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sách:', error);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {/* Header */}
      <nav className={headerStyles.navbar}>
        <ul>
          <li><a href="/home">Trang chủ</a></li>
          <li><a href="/bookCase">Tủ sách</a></li>
          <li><a href="/favoriteBook">Yêu thích</a></li>
          <li><a href="/bill">Lịch sử mượn sách</a></li>
          <li className={`${headerStyles.right} ${headerStyles.dropdown}`}>
            <a href="#">Tài khoản</a>
            <ul className={headerStyles['dropdown-menu']}>
              <li><a href="/account">Thông tin chi tiết</a></li>
              <li><a href="/bookCart">Giỏ sách</a></li>
              <li><a href="/changePassword">Đổi mật khẩu</a></li>
              <li><a href="/login">Đăng xuất</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Nội dung chính */}
      <div className={billStyles.container}>
        <div className={billStyles.box}>
          <div className={historyStyles['status-container']}>
            <a className={historyStyles.status} href="/bill">Hóa đơn</a>
            <a className={`${historyStyles.status} ${historyStyles.active}`} href="/borrowing">Sách đang mượn</a>
            <a className={historyStyles.status} href="/borrowed">Sách đã mượn</a>
          </div>
        </div>

        <div className={bookCartStyles['cart-container']}>
          <h2 className={bookCartStyles['cart-title']}>Danh sách sách đang mượn</h2>
          <div className={bookCartStyles['book-list']}>
            {books.length === 0 ? (
              <p>Không có sách nào đang mượn.</p>
            ) : (
              books.map((item, index) => (
                <div key={index} className={bookCartStyles['book-card']}>
                  <img src={`http://localhost:8080${item.book.imageUrl}`} alt={item.book.bookName} />
                  <div className={bookCartStyles['book-info']}>
                    <p><strong>Tên:</strong> {item.book.bookName}</p>
                    <p><strong>Tác giả:</strong> {item.book.author}</p>
                    <p><strong>Nhà xuất bản:</strong> {item.book.publisher}</p>
                    <p><strong>Năm xuất bản:</strong> {item.book.yearOfpublication}</p>
                    <p><strong>Số lượng:</strong> {item.quantity}</p>
                    <p><strong>Hạn:</strong> {formatDate(item.dueDate)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Phân trang */}
          <div className={historyStyles.pagination}>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
              &laquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(i => Math.abs(i - currentPage) <= 2 || i === 1 || i === totalPages)
              .map((i, idx, arr) => (
                <React.Fragment key={i}>
                  {idx > 0 && i - arr[idx - 1] > 1 && <span>...</span>}
                  <button
                    className={i === currentPage ? historyStyles.active : ''}
                    onClick={() => goToPage(i)}
                  >
                    {i}
                  </button>
                </React.Fragment>
              ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowingBooks;

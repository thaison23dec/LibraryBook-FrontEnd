import React, { useEffect, useState } from 'react';
import headerStyles from '../../assets/css/header.module.css';
import bookCaseStyles from '../../assets/css/bookCase.module.css';

const FavoriteBooks = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(false);
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
    fetchBooks(page);
  }, [page]);

  const fetchBooks = async (currentPage) => {
    try {
      const response = await fetch(`/api/favorite/list?pageSize=10&page=${currentPage}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBooks(data.favoriteBooks);
      setTotalPages(data.totalPages);
      setError(false);
    } catch (err) {
      setError(true);
      setBooks([]);
    }
  };

  const renderBooks = () => {
    if (error) return <p>Không thể tải danh sách yêu thích.</p>;
    if (books.length === 0) return <p>Không có sách yêu thích nào.</p>;

    return books.map((book) => (
      <div key={book.id} className={bookCaseStyles.book}>
        <a href={`/bookDetail?bookId=${book.id}`}>
          <img src={`http://localhost:8080${book.imageUrl}`} alt={book.bookName} />
          <p>{book.bookName}</p>
        </a>
      </div>
    ));
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    if (page > 1) {
      buttons.push(
        <button key="prev" onClick={() => setPage(page - 1)}>&laquo;</button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={i === page ? bookCaseStyles.active : ''}
        >
          {i}
        </button>
      );
    }

    if (page < totalPages) {
      buttons.push(
        <button key="next" onClick={() => setPage(page + 1)}>&raquo;</button>
      );
    }

    return <div className={bookCaseStyles.pagination}>{buttons}</div>;
  };

  return (
    <div>
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

      {/* Main content */}
      <div className={bookCaseStyles.container}>
        <div className={bookCaseStyles.box}>
          <h1>Danh sách yêu thích</h1>
        </div>
        <div className={bookCaseStyles['book-list']}>
          {renderBooks()}
        </div>
        {renderPagination()}
      </div>
    </div>
  );
};

export default FavoriteBooks;

import React, { useEffect, useState } from 'react';
import headerStyles from '../../assets/css/header.module.css';
import bookCaseStyles from '../../assets/css/bookCase.module.css';
import axios from 'axios';

const BookCase = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
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

  const [filters, setFilters] = useState({
    bookName: '',
    author: '',
    publisher: '',
    categories: [],
    pageSize: 10,
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, [filters.page, filters.pageSize]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories/getCategories');
      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách thể loại:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/api/book/search', {
        params: {
          ...filters,
          categories: filters.categories
        },
        paramsSerializer: params => new URLSearchParams(params).toString()
      });
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Lỗi khi tải danh sách sách:', err);
    }
  };

  const handleInputChange = e => {
    setFilters({ ...filters, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = e => {
    const value = e.target.value;
    const newCategories = e.target.checked
      ? [...filters.categories, value]
      : filters.categories.filter(cat => cat !== value);
    setFilters({ ...filters, categories: newCategories });
  };

  const handleSearch = () => {
    setFilters({ ...filters, page: 1 });
    fetchBooks();
  };

  const changePage = (page) => {
    setFilters({ ...filters, page });
  };

  const renderPagination = () => {
    const buttons = [];
    const startPage = Math.max(1, filters.page - 2);
    const endPage = Math.min(totalPages, filters.page + 2);

    if (filters.page > 1) {
      buttons.push(<button key="prev" onClick={() => changePage(filters.page - 1)}>&laquo;</button>);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={filters.page === i ? bookCaseStyles.active : ''}
          onClick={() => changePage(i)}
        >
          {i}
        </button>
      );
    }

    if (filters.page < totalPages) {
      buttons.push(<button key="next" onClick={() => changePage(filters.page + 1)}>&raquo;</button>);
    }

    return buttons;
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

      <div className={bookCaseStyles.container}>
        <div className={bookCaseStyles.box}>
          <h1>Tủ sách</h1>
        </div>

        <div className={bookCaseStyles['search-container']}>
          <h2>Tìm kiếm sách</h2>
          <div className={bookCaseStyles['search-box']}>
            <div className={bookCaseStyles['input-row']}>
              <input type="text" id="bookName" placeholder="Tên sách" value={filters.bookName} onChange={handleInputChange} />
              <input type="text" id="author" placeholder="Tên tác giả" value={filters.author} onChange={handleInputChange} />
              <input type="text" id="publisher" placeholder="Nhà xuất bản" value={filters.publisher} onChange={handleInputChange} />
            </div>
            <div className={bookCaseStyles['category-row']}>
              <label>Thể loại:</label>
              <div className={bookCaseStyles['checkbox-container']}>
                {categories.length > 0 && categories.map((cat, i) => (
                  <div key={cat.id} className={bookCaseStyles['checkbox-group']}>
                    <input
                      type="checkbox"
                      id={`cat-${cat.id}`}
                      value={cat.id}
                      name="categories"
                      onChange={handleCheckboxChange}
                      checked={filters.categories.includes(cat.id.toString())}
                    />
                    <label htmlFor={`cat-${cat.id}`}>{cat.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={bookCaseStyles['pagination-control']}>
            <label htmlFor="pageSize">Kích thước trang:</label>
            <select id="pageSize" value={filters.pageSize} onChange={handleInputChange}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <button className={bookCaseStyles.btn} onClick={handleSearch}>Tìm kiếm</button>
        </div>

        <div className={bookCaseStyles['book-list']}>
          {books.length === 0 ? (
            <p>Không tìm thấy sách nào!</p>
          ) : (
            books.map(book => (
              <div key={book.id} className={bookCaseStyles.book}>
                <a href={`/bookDetail?bookId=${book.id}`}>
                  <img src={`http://localhost:8080${book.imageUrl}`} alt={book.bookName} />
                </a>
                <p>{book.bookName}</p>
              </div>
            ))
          )}
        </div>

        <div className={bookCaseStyles.pagination}>
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default BookCase;

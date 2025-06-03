import React, { useEffect, useState } from "react";

import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import searchBoxStyle from "../../../assets/css/searchBox.module.css";

const ListBook = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch("/api/categories/getCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi lấy danh sách thể loại:", err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (bookName) params.append("bookName", bookName);
    if (author) params.append("author", author);
    if (publisher) params.append("publisher", publisher);
    selectedCategories.forEach((cat) => params.append("categories", cat));
    params.append("pageSize", pageSize);
    params.append("page", currentPage);

    fetch("/api/book/search?" + params.toString())
      .then((res) => res.json())
      .then((response) => {
        setBooks(response.books);
        setTotalPages(response.totalPages);
      })
      .catch((err) => console.error("Lỗi khi tải danh sách sách:", err));
  }, [bookName, author, publisher, selectedCategories, pageSize, currentPage]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
  };

  const handleDelete = (id) => {
  if (!window.confirm(`Bạn có chắc muốn xóa sách id = ${id} ?`)) return;
  fetch(`/api/book/delete/${id}`, { method: "POST" })
    .then(() => window.location.reload()) // Reload lại trang sau khi xóa
    .catch((err) => console.error("Lỗi khi xóa sách:", err));
};


  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPagination = () => {
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
  };

  return (
    <>
      {/* Header */}
      <nav className={headerStyle.navbar}>
        <ul>
          <li>
            <a href="#">Trang quản trị</a>
          </li>
          <li className={`${headerStyle.right} ${headerStyle.dropdown}`}>
            <a href="#">Tài khoản</a>
            <ul className={headerStyle["dropdown-menu"]}>
              <li>
                <a href="adminProfile">Thông tin chi tiết</a>
              </li>
              <li>
                <a href="/adminChangePassword">Đổi mật khẩu</a>
              </li>
              <li>
                <a href="/login">Đăng xuất</a>
              </li>
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
          <h2>Tìm kiếm sách</h2>
          <div className={searchBoxStyle.searchContainer}>
            <div className={searchBoxStyle.searchBox}>
              <input
                type="text"
                placeholder="Tên sách"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Tên tác giả"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nhà xuất bản"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
              />
              
            </div>

            <div className={searchBoxStyle.categoryRow}>
              <label>Thể loại:</label>
              <div className={searchBoxStyle["checkbox-container"]}>
                {categories.length === 0 && <p>Đang tải thể loại...</p>}
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={searchBoxStyle["checkbox-group"]}
                  >
                    <input
                      type="checkbox"
                      name="categories"
                      value={category.id}
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(String(category.id))}
                      onChange={handleCategoryChange}
                    />
                    <label htmlFor={`cat-${category.id}`}>{category.name}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className={searchBoxStyle.paginationControl}>
              <label htmlFor="pageSize">Kích thước trang:</label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button
                className={manageStyles.btn}
                onClick={() => setCurrentPage(1)}
              >
                Tìm kiếm
              </button>
          </div>

          <div className={manageStyles.info}>
            <h2>Bảng danh sách sách</h2>
            <a href="editBook" className={manageStyles.btn}>Thêm sách</a>
          </div>

          <table className={manageStyles.table}>
            <thead>
              <tr>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Nhà xuất bản</th>
                <th>Năm xuất bản</th>
                <th>Thể loại</th>
                <th>Số lượng</th>
                <th>Có sẵn</th>
                <th style={{ minWidth: "120px" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    Không có sách nào!
                  </td>
                </tr>
              ) : (
                books.map((book) => {
                  const categoriesOfBook = book.categoriesOfBook
                    ? book.categoriesOfBook.map((c) => c.name).join(", ")
                    : "Không có thể loại";
                  return (
                    <tr key={book.id}>
                      <td>{book.id}</td>
                      <td>{book.bookName}</td>
                      <td>{book.author}</td>
                      <td>{book.publisher}</td>
                      <td>{book.yearOfpublication}</td>
                      <td>{categoriesOfBook}</td>
                      <td>{book.quantity}</td>
                      <td>{book.availableQuantity}</td>
                      <td className={manageStyles.actions}>
                        <a href={`edit?id=${book.id}`}>
                          <img
                            src="/picture/pencil-icon.png"
                            alt="Sửa"
                            style={{ cursor: "pointer" }}
                          />
                        </a>
                        <img
                          src="/picture/delete.png"
                          alt="Xóa"
                          onClick={() => handleDelete(book.id)}
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        />
                      </td>
                    </tr>
                  );
                })
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

export default ListBook;

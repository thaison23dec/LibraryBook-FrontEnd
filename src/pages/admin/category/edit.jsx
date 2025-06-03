import React, { useEffect, useState } from "react";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import editStyles from "../../../assets/css/edit.module.css";
import axios from "axios";

const EditCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCategories();
    checkEditCategory();
  }, [currentPage]);

  const loadCategories = async () => {
    try {
      const response = await axios.get("/api/categories", {
        params: {
          pageSize: 6,
          page: currentPage,
        },
      });
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thể loại:", error);
    }
  };

  const saveCategory = async () => {
    if (!categoryName.trim()) {
      alert("Tên thể loại không được để trống!");
      return;
    }
    try {
      await axios.post("/api/categories/save", {
        id: categoryId,
        name: categoryName,
      });
      window.location.href = "/editCategory";
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi lưu thể loại");
      console.error("Lỗi khi lưu thể loại:", error);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thể loại này?")) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      loadCategories();
    } catch (error) {
      console.error("Lỗi khi xóa thể loại:", error);
    }
  };

  const checkEditCategory = async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      try {
        const response = await axios.get(`/api/categories/${id}`);
        setCategoryName(response.data.name);
        setCategoryId(response.data.id);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thể loại:", error);
      }
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    let buttons = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage > 1) {
      buttons.push(
        <button key="prev" onClick={() => goToPage(currentPage - 1)}>
          &laquo;
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={i === currentPage ? "active" : ""}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      buttons.push(
        <button key="next" onClick={() => goToPage(currentPage + 1)}>
          &raquo;
        </button>
      );
    }

    return buttons;
  };

  return (
    <div>
      {/* Navbar */}
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

        <div className={editStyles.formBox}>
          <div className={editStyles.title}>Thêm thể loại</div>
          <div className={editStyles.formGroup}>
            <label htmlFor="category_name" className={editStyles.label}>
              Tên thể loại
            </label>
            <input
              type="text"
              id="category_name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className={editStyles.input}
            />
          </div>
          <div className={editStyles.btnGroup}>
            <button className={`${editStyles.btn} ${editStyles.btnAdd}`} onClick={saveCategory}>
              Lưu thể loại
            </button>
            <a href="edit" className={`${editStyles.btn} ${editStyles.btnDanger}`}>
              Hủy
            </a>
          </div>
        </div>

        <div className={manageStyles.content}>
          <div className={editStyles.title}>Danh sách thể loại</div>
          <table className={manageStyles.table}>
            <thead>
              <tr>
                <th>Tên thể loại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    <div className={manageStyles.actions}>
                      <button
                        className={`${editStyles.btn} ${editStyles.btnAdd}`}
                        onClick={() => (window.location.href = `/editCategory?id=${category.id}`)}
                      >
                        Sửa
                      </button>
                      <button
                        className={`${editStyles.btn} ${editStyles.btnDanger}`}
                        onClick={() => deleteCategory(category.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div id="pagination" className={manageStyles.pagination}>
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;

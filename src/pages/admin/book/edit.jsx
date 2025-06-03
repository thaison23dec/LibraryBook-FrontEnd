import React, { useEffect, useState } from "react";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import editStyles from "../../../assets/css/edit.module.css";

const BookEdit = () => {
  const [categories, setCategories] = useState([]);
  const [bookId, setBookId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    publisher: "",
    yearOfpublication: "",
    quantity: 0,
    describe: "",
    image: null,
    currentImageUrl: "",
    categories: [],
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const urlParam = new URLSearchParams(window.location.search);
    const id = urlParam.get("id");
    if (id) {
      setBookId(id);
      fetchBook(id);
    }
    fetchCategories();
  }, []);

  const fetchBook = async (id) => {
    try {
      const res = await fetch(`/api/book/${id}`);
      if (!res.ok) throw new Error("Failed to fetch book");
      const book = await res.json();
      setFormData((prev) => ({
        ...prev,
        name: book.bookName || "",
        author: book.author || "",
        publisher: book.publisher || "",
        yearOfpublication: book.yearOfpublication || "",
        quantity: 0,
        describe: book.describe || "",
        currentImageUrl: book.imageUrl || "",
        categories: book.categoriesOfBook ? book.categoriesOfBook.map((c) => c.id) : [],
      }));
      if (book.imageUrl) setImagePreview(book.imageUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories/getCategories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const categories = await res.json();
      setCategories(categories);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else if (name === "categories") {
      let newCategories = [...formData.categories];
      const val = parseInt(value);
      if (checked) {
        if (!newCategories.includes(val)) newCategories.push(val);
      } else {
        newCategories = newCategories.filter((c) => c !== val);
      }
      setFormData((prev) => ({ ...prev, categories: newCategories }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value) || 0 : value,
      }));
    }
  };

  const addBook = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("author", formData.author);
    data.append("publisher", formData.publisher);
    data.append("yearOfpublication", formData.yearOfpublication);
    data.append("quantity", formData.quantity);
    data.append("describe", formData.describe);
    data.append("currentImageUrl", formData.currentImageUrl);
    if (formData.image) data.append("image", formData.image);
    formData.categories.forEach((catId) => data.append("categories", catId));

    try {
      const res = await fetch("/api/book/save", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Thêm sách thất bại");
      alert("Thêm sách thành công!");
      window.location.href = "/listBook";
    } catch (error) {
      alert("Lỗi khi thêm sách!");
      console.error(error);
    }
  };

  const updateBook = async () => {
    if (!bookId) return;
    const data = new FormData();
    data.append("name", formData.name);
    data.append("author", formData.author);
    data.append("publisher", formData.publisher);
    data.append("yearOfpublication", formData.yearOfpublication);
    data.append("quantity", formData.quantity);
    data.append("describe", formData.describe);
    data.append("currentImageUrl", formData.currentImageUrl);
    if (formData.image) data.append("image", formData.image);
    formData.categories.forEach((catId) => data.append("categories", catId));

    try {
      const res = await fetch(`/api/book/update/${bookId}`, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Cập nhật sách thất bại");
      alert("Cập nhật sách thành công!");
      window.location.href = "/admin/book/list";
    } catch (error) {
      alert("Lỗi khi cập nhật sách!");
      console.error(error);
    }
  };

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

        <div className={editStyles.formBox}>
          <h2 className={editStyles.title}>Cập nhật sách</h2>
          <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">
            {[
              { label: "Tên sách", name: "name", type: "text", required: true },
              { label: "Tác giả", name: "author", type: "text", required: true },
              { label: "Nhà xuất bản", name: "publisher", type: "text" },
              { label: "Năm xuất bản", name: "yearOfpublication", type: "text" },
              { label: "Số lượng nhập thêm", name: "quantity", type: "number", required: true, min: 0 },
              { label: "Mô tả", name: "describe", type: "text" }
            ].map(({ label, name, type, required, min }) => (
              <div key={name} className={editStyles.formGroup}>
                <label className={editStyles.label} htmlFor={name}>{label}</label>
                <input
                  className={editStyles.input}
                  type={type}
                  name={name}
                  required={required}
                  value={formData[name]}
                  min={min}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className={editStyles.formGroup}>
              <label className={editStyles.label}>Thể loại</label>
              <div className={editStyles.checkboxRow}>
                {categories.length === 0 ? (
                  <p>Đang tải thể loại...</p>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className={editStyles.checkboxGroup}>
                      <input
                        type="checkbox"
                        name="categories"
                        id={`cat-${category.id}`}
                        value={category.id}
                        checked={formData.categories.includes(category.id)}
                        onChange={handleChange}
                      />
                      <label htmlFor={`cat-${category.id}`}>{category.name}</label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={editStyles.formGroup}>
              <label className={editStyles.label} htmlFor="image">Ảnh</label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Xem trước"
                  style={{ marginTop: 10, maxWidth: 200 }}
                />
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              <input type="hidden" name="currentImageUrl" value={formData.currentImageUrl} />
            </div>

            <div className={editStyles.btnGroup}>
              {!bookId ? (
                <button type="button" className={`${editStyles.btn} ${editStyles.btnAdd}`} onClick={addBook}>
                  Thêm sách
                </button>
              ) : (
                <button type="button" className={`${editStyles.btn} ${editStyles.btnAdd}`} onClick={updateBook}>
                  Cập nhật sách
                </button>
              )}
              <a className={`${editStyles.btn} ${editStyles.btnDanger}`} href="/listBook">
                Hủy
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookEdit;

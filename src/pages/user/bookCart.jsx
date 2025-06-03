import React, { useEffect, useState } from 'react';
import headerStyles from '../../assets/css/header.module.css';
import bookCartStyles from '../../assets/css/bookCart.module.css';

function BookCart() {
  const [cartDetails, setCartDetails] = useState([]);

  const getListBook = async () => {
    try {
      const response = await fetch('/api/cart/list');
      if (!response.ok) throw new Error('Không thể tải danh sách giỏ hàng');
      const data = await response.json();
      setCartDetails(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sách:', error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      const response = await fetch(`/api/cart/update/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newQuantity }),
      });

      if (!response.ok) {
        const res = await response.json();
        alert(res.message);
      }
      getListBook();
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
    }
  };

  const deleteCartDetail = async (id) => {
    try {
      const response = await fetch(`/api/cart/remove/${id}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Xóa thất bại');
      getListBook();
    } catch (error) {
      alert('Xóa sách thất bại. Vui lòng thử lại!');
    }
  };

  const borrowBooks = async () => {
    try {
      const response = await fetch('/api/borrow/borrowaction', {
        method: 'POST',
      });
      const res = await response.json();
      alert(res.message);
      getListBook();
    } catch (error) {
      const res = await error.response?.json();
      alert(res?.message || 'Có lỗi xảy ra khi mượn sách');
    }
  };

  useEffect(() => {
    getListBook();
  }, []);

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

      {/* Giỏ hàng */}
      <div className={bookCartStyles['cart-container']}>
        <h2 className={bookCartStyles['cart-title']}>Giỏ hàng</h2>
        <div className={bookCartStyles['book-list']}>
          {cartDetails.length === 0 ? (
            <p>Không có sách nào trong giỏ hàng</p>
          ) : (
            cartDetails.map((cartDetail) => (
              <div key={cartDetail.id} className={bookCartStyles['book-card']}>
                <span
                  className={bookCartStyles['close-btn']}
                  onClick={() => deleteCartDetail(cartDetail.id)}
                >
                  X
                </span>
                <img
                  src={`http://localhost:8080${cartDetail.book.imageUrl}`}
                  alt={cartDetail.book.bookName}
                />
                <div className={bookCartStyles['book-info']}>
                  <p><strong>Tên: </strong>{cartDetail.book.bookName}</p>
                  <p><strong>Tác giả: </strong>{cartDetail.book.author}</p>
                  <p><strong>Nhà xuất bản: </strong>{cartDetail.book.publisher}</p>
                  <p><strong>Năm xuất bản: </strong>{cartDetail.book.yearOfpublication}</p>
                  <p><strong>Số lượng khả dụng: </strong>{cartDetail.book.availableQuantity}</p>
                  <p>
                    <strong>Số lượng: </strong>
                    <input
                      type="number"
                      className={bookCartStyles.quantity}
                      value={cartDetail.quantity}
                      min={0}
                      max={cartDetail.book.availableQuantity}
                      onChange={(e) =>
                        setCartDetails((prevDetails) =>
                          prevDetails.map((detail) =>
                            detail.id === cartDetail.id
                              ? { ...detail, quantity: e.target.value }
                              : detail
                          )
                        )
                      }
                    />
                    <button
                      className={bookCartStyles['update-btn']}
                      onClick={() =>
                        updateQuantity(cartDetail.id, cartDetail.quantity)
                      }
                    >
                      Cập nhật
                    </button>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <button className={bookCartStyles['borrow-btn']} onClick={borrowBooks}>
          Mượn sách
        </button>
      </div>
    </>
  );
}

export default BookCart;

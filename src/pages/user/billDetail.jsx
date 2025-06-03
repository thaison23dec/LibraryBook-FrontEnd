import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import headerStyles from '../../assets/css/header.module.css';
import billStyles from '../../assets/css/bill.module.css';
import billDetailStyles from '../../assets/css/billDetail.module.css';

function BillDetail() {
  const [billData, setBillData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const borrowingId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (!borrowingId) {
      alert('Không tìm thấy mã hóa đơn!');
      navigate('/bill');
      return;
    }

    fetch(`/api/borrow/borrowing/detail/${borrowingId}`)
      .then((res) => res.json())
      .then((data) => setBillData(data))
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết hóa đơn:', err);
        alert('Không thể tải chi tiết hóa đơn!');
      });
  }, [borrowingId, navigate]);

  const handlePrint = () => {
    window.print();
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

      {/* Content */}
      <div className={billStyles.content}>
        <h2>Chi Tiết Hóa Đơn</h2>

        {billData && (
          <>
            <div className={billDetailStyles['customer-info']}>
              <p><strong>Khách hàng:</strong> {billData.user?.username}</p>
              <p><strong>Email:</strong> {billData.user?.email}</p>
            </div>

            <table className={billDetailStyles['book-list']}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Nhà xuất bản</th>
                  <th>Năm xuất bản</th>
                  <th>Thể loại</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(billData.borrowDetails) && billData.borrowDetails.length > 0 ? (
                  billData.borrowDetails.map((detail, index) => {
                    const categories = detail.book.categoriesOfBook?.map(c => c.name).join(', ') || 'Không có thể loại';
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{detail.book.bookName}</td>
                        <td>{detail.book.author}</td>
                        <td>{detail.book.publisher}</td>
                        <td>{detail.book.yearOfpublication}</td>
                        <td>{categories}</td>
                        <td>{detail.quantity}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="7">Không có sách nào.</td></tr>
                )}
              </tbody>
            </table>

            <div className={billDetailStyles.but}>
              <a href="/bill" className={billDetailStyles['btn-back']}>Quay lại danh sách hóa đơn</a>
              <button onClick={handlePrint} className={billDetailStyles['btn-print']}>In hóa đơn</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default BillDetail;

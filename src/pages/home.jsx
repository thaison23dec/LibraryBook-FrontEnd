import React, { useState, useEffect } from "react";
import homeStyles from '../assets/css/home.module.css';
import headerStyles from '../assets/css/header.module.css';
import footerStyles from '../assets/css/footer.module.css';

function Home() {
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

  return (
    <>
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

      {/* Main Content */}
      <div className={homeStyles.container}>
        <div className={homeStyles['content-box']}>
          <h2>Đọc được nhiều sách hơn và đọc tốt hơn với Thư viện sách</h2>
          <p>
            Bạn thích đọc sách giấy nhưng vẫn còn gặp phải nhiều khó khăn: không biết nên chọn tựa sách nào, mua ở đâu, 
            sách có phải sách thật hay không, giá cả thế nào, bảo quản ra sao hoặc nếu không có nhu cầu đọc nữa thì bán lại cho ai? 
          </p>
          <p>
            <strong>Thư viện sách</strong> giúp bạn dễ dàng tiếp cận với kho sách khổng lồ mà không cần phải lo lắng về chi phí mua sách. 
            Bạn có thể thuê sách, đọc thử trước khi mua hoặc chia sẻ sách với cộng đồng.
          </p>
          <p>
            Chúng tôi mang đến một trải nghiệm đọc sách tiện lợi, tiết kiệm và thân thiện với môi trường. 
            Cùng khám phá hàng ngàn cuốn sách và tận hưởng niềm vui đọc mỗi ngày! 📚✨
          </p>
        </div>
      </div>

      {/* Logo */}
      <img src="/picture/logo.webp" alt="LibraryBook Logo" className={homeStyles.logo} />

      {/* Feature Section */}
      <div className={homeStyles.feature}>
        <div className={homeStyles['feature-item']}>
          <img src="/picture/doc_sach_khong_gioi_han.webp" alt="Đọc sách không giới hạn" />
          <div className={homeStyles['feature-text']}>
            <h2>Đọc sách không giới hạn</h2>
            <p>Thoải mái đọc như sách của bạn: Không giới hạn số ngày giữ sách, không phí phạt chậm trả.</p>
          </div>
        </div>

        <div className={homeStyles['feature-item']}>
          <div className={homeStyles['feature-text']}>
            <h2>Đọc sách không nhìn giá</h2>
            <p>Không phải canh sales, tính giá bán hay giá thuê: phí thành viên tại Thư viện sách là cố định và cực kì hợp lý.</p>
          </div>
          <img src="/picture/đọc sách không nhìn giá.webp" alt="Đọc sách không nhìn giá" />
        </div>

        <div className={homeStyles['feature-item']}>
          <img src="/picture/doc_sach_chat_luong.webp" alt="Đọc sách chất lượng" />
          <div className={homeStyles['feature-text']}>
            <h2>Đọc sách chất lượng</h2>
            <p>Tủ sách hàng tuyển: Libri chọn lựa rất kỹ tựa sách khi nhập về, bạn hoàn toàn có thể tin tưởng vào chất lượng kiến thức nạp vào.</p>
          </div>
        </div>

        <div className={homeStyles['feature-item']}>
          <div className={homeStyles['feature-text']}>
            <h2>Trải nghiệm miễn phí</h2>
            <p>Bạn sẽ có 2 tháng để làm quen: không tính phí thành viên, đọc rồi trả lại không tham gia cũng không sao.</p>
          </div>
          <img src="/picture/trải nghiệm miễn phí.webp" alt="Trải nghiệm miễn phí" />
        </div>
      </div>

      {/* Footer */}
      <footer className={`${footerStyles.footer} ${footerStyles['home-footer']}`}>
        <div className={footerStyles['footer-container']}>
          <div className={footerStyles['text-box']}>
            <p><strong>Cơ sở:</strong></p>
            <p>79 Phan Chu Trinh, Yết Kiêu, Hà Đông, Hà Nội</p>
          </div>
          <div className={footerStyles['text-box']}>
            <p><strong>Liên hệ Thư Viện sách:</strong></p>
            <p><strong>Số điện thoại:</strong> <a href="tel:0988265438">0988265438</a></p>
            <p><strong>Email:</strong> <a href="mailto:librarybook@gmail.com">librarybook@gmail.com</a></p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;

import React, { useEffect, useState } from "react";
import headerStyle from "../../../assets/css/header.module.css";
import manageStyles from "../../../assets/css/manage.module.css";
import searchBoxStyles from "../../../assets/css/searchBox.module.css";

function RentalDetail() {
  const [customerId, setCustomerId] = useState(null);
  const [borrowingBooks, setBorrowingBooks] = useState([]);
  const [userInfo, setUserInfo] = useState({ fullName: "", phoneNumber: "", email: "" });
  const [selectedBooks, setSelectedBooks] = useState({}); // key: borrowingBook.id, value: { quantity, punishCost, reason }

  useEffect(() => {
    // Lấy customerId từ URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("customerId");
    setCustomerId(id);

    if (id) {
      loadBorrowingBooks(id);
      loadUser(id);
    }
  }, []);

  const loadBorrowingBooks = (id) => {
    fetch(`/api/borrow/borrowing/book/list/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBorrowingBooks(data);
        // Khởi tạo selectedBooks với quantity=0, punishCost=0, reason=""
        let initSelected = {};
        data.forEach((item) => {
          initSelected[item.id] = { quantity: 0, punishCost: 0, reason: "" };
        });
        setSelectedBooks(initSelected);
      })
      .catch((error) => console.error("Lỗi khi tải danh sách sách:", error));
  };

  const loadUser = (id) => {
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => setUserInfo(data))
      .catch((error) => console.error("Lỗi khi tải user:", error));
  };

  // Format ngày tháng theo chuẩn Việt Nam (dd/mm/yyyy)
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN");
  };

  // Xử lý khi checkbox thay đổi (chọn sách trả)
  const handleCheckboxChange = (e, borrowingBook) => {
    const checked = e.target.checked;
    setSelectedBooks((prev) => {
      if (checked) {
        return { ...prev }; // giữ nguyên (đã có quantity, punishCost, reason)
      } else {
        // Bỏ chọn -> reset quantity, punishCost, reason
        return { ...prev, [borrowingBook.id]: { quantity: 0, punishCost: 0, reason: "" } };
      }
    });
  };

  // Xử lý input quantity, punishCost, reason thay đổi
  const handleInputChange = (borrowingBookId, field, value) => {
    setSelectedBooks((prev) => ({
      ...prev,
      [borrowingBookId]: {
        ...prev[borrowingBookId],
        [field]: value,
      },
    }));
  };

  // Xử lý click nút Thanh toán
  const handlePayment = () => {
    if (!customerId) return alert("Không có mã khách hàng");

    // Lấy danh sách sách được chọn
    const paymentList = [];

    for (const [id, data] of Object.entries(selectedBooks)) {
      const borrowingBook = borrowingBooks.find((b) => b.id.toString() === id);

      if (!borrowingBook) continue;

      // Kiểm tra checkbox có được chọn không
      const checkbox = document.getElementById("bor-" + id);
      if (!checkbox || !checkbox.checked) continue;

      const quantity = parseInt(data.quantity) || 0;
      const punishCost = parseInt(data.punishCost) || 0;
      const maxQuantity = borrowingBook.quantity;

      if (quantity > maxQuantity) {
        alert(
          `Số lượng trả sách ${borrowingBook.book.bookName} không được vượt quá ${maxQuantity}`
        );
        return;
      }

      paymentList.push({
        book: borrowingBook.book,
        bookLoanDate: borrowingBook.bookLoanDate,
        dueDate: borrowingBook.dueDate,
        quantity: quantity,
        punishCost: punishCost,
        reason: data.reason || "Không có",
        total: punishCost + quantity * 10000,
      });
    }

    if (paymentList.length === 0) {
      alert("Vui lòng chọn ít nhất một sách để thanh toán.");
      return;
    }

    fetch(`/api/payment/new/detail/${customerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentList),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi server khi thanh toán");
        return res.json();
      })
      .then(() => {
        window.location.href = `/payment?customerId=${customerId}`;
      })
      .catch((error) => {
        console.error("Lỗi khi gửi dữ liệu thanh toán:", error);
        alert("Thanh toán thất bại!");
      });
  };

  return (
    <>
        {/* Header */}
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

      {/* Sidebar */}
      <div className={manageStyles.sidebar}>
        <a href="/listCustomer">Quản lý khách hàng</a>
        <a href="/listEmployee">Quản lý nhân viên</a>
        <a href="/editCategory">Quản lý thể loại</a>
        <a href="/listBook">Quản lý sách</a>
        <a href="/listRental">Quản lý thuê sách</a>
        <a href="/listInvoice">Hóa đơn</a>
      </div>

      {/* Main content */}
      <div className={manageStyles.content}>
        <a href="/listRental" className={manageStyles["backBtn"]}>
          Back
        </a>

        <h2>Thông tin khách hàng</h2>
        <div className={searchBoxStyles.searchContainer}>
          <div className={searchBoxStyles.searchBox}>
            <input
              type="text"
              id="fullName"
              placeholder="Họ và tên"
              value={userInfo.fullName || ""}
              readOnly
            />
            <input
              type="text"
              id="phone"
              placeholder="Số điện thoại"
              value={userInfo.phoneNumber || ""}
              readOnly
            />
            <input
              type="text"
              id="email"
              placeholder="Email"
              value={userInfo.email || ""}
              readOnly
            />
          </div>
        </div>


        <div className={manageStyles.info}>
          <h2>Bảng danh sách sách đang mượn</h2>
          <button
            id="paymentBtn"
            className={manageStyles.btn}
            style={{ backgroundColor: "#5a9bd5" }}
            onClick={handlePayment}
          >
            Thanh toán
          </button>
        </div>

        <table className={manageStyles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Số lượng</th>
              <th>Ngày mượn</th>
              <th>Hạn</th>
              <th>Số lượng trả</th>
              <th>Tiền phạt</th>
              <th>Lý do</th>
            </tr>
          </thead>
          <tbody>
            {borrowingBooks.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center" }}>
                  Không có sách đang mượn
                </td>
              </tr>
            )}

            {borrowingBooks.map((borrowingBook) => (
              <tr key={borrowingBook.id}>
                <td>
                  <input
                    type="checkbox"
                    name="borrowingBook"
                    id={"bor-" + borrowingBook.id}
                    value={borrowingBook.id}
                    data-book={JSON.stringify(borrowingBook.book)}
                    data-book-loan-date={borrowingBook.bookLoanDate}
                    data-due-date={borrowingBook.dueDate}
                    data-quantity={borrowingBook.quantity}
                    onChange={(e) => handleCheckboxChange(e, borrowingBook)}
                  />
                </td>
                <td>{borrowingBook.book.id}</td>
                <td>{borrowingBook.book.bookName}</td>
                <td>{borrowingBook.book.author}</td>
                <td>{borrowingBook.quantity}</td>
                <td>{formatDateTime(borrowingBook.bookLoanDate)}</td>
                <td>{formatDateTime(borrowingBook.dueDate)}</td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={borrowingBook.quantity}
                    value={selectedBooks[borrowingBook.id]?.quantity || ""}
                    onChange={(e) =>
                      handleInputChange(borrowingBook.id, "quantity", e.target.value)
                    }
                    disabled={
                      !document.getElementById("bor-" + borrowingBook.id)?.checked
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={selectedBooks[borrowingBook.id]?.punishCost || ""}
                    onChange={(e) =>
                      handleInputChange(borrowingBook.id, "punishCost", e.target.value)
                    }
                    disabled={
                      !document.getElementById("bor-" + borrowingBook.id)?.checked
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={selectedBooks[borrowingBook.id]?.reason || ""}
                    onChange={(e) =>
                      handleInputChange(borrowingBook.id, "reason", e.target.value)
                    }
                    disabled={
                      !document.getElementById("bor-" + borrowingBook.id)?.checked
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RentalDetail;

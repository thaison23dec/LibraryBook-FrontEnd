import React, { useState, useEffect, useRef } from "react";
import headerStyles from "../../assets/css/header.module.css";
import commentStyles from "../../assets/css/comment.module.css";
import accountStyles from "../../assets/css/account.module.css";

const BookDetail = () => {
  const [bookId, setBookId] = useState(null);
  const [book, setBook] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const actionMenuRefs = useRef({});
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
    const params = new URLSearchParams(window.location.search);
    const id = params.get("bookId");
    if (!id) {
      alert("Thiếu bookId!");
      window.location.href = "/bookCase";
      return;
    }
    setBookId(id);
  }, []);

  useEffect(() => {
    if (!bookId) return;

    fetch(`/api/book/${bookId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy sách!");
        return res.json();
      })
      .then((data) => {
        setBook(data);
      })
      .catch(() => {
        alert("Không tìm thấy sách!");
        window.location.href = "/bookCase";
      });

    fetch(`/api/favorite/check/${bookId}`)
      .then((res) => res.json())
      .then((favorited) => setIsFavorited(favorited))
      .catch(() => console.error("Lỗi khi kiểm tra trạng thái yêu thích."));

    fetch(`/api/comment/list/${bookId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(
          data.comments.sort(
            (a, b) => new Date(b.time) - new Date(a.time)
          )
        );
        setCurrentUser(data.user || null);
      })
      .catch(() => console.error("Lỗi khi tải bình luận"));
  }, [bookId]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const toggleFavorite = () => {
    fetch(`/api/favorite/toggle/${bookId}`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setIsFavorited((f) => !f);
        alert(
          isFavorited
            ? "Đã xóa khỏi danh mục yêu thích!"
            : "Đã thêm vào danh mục yêu thích!"
        );
      })
      .catch(() => {
        alert("Lỗi: Không thể cập nhật danh mục yêu thích.");
      });
  };

  const addToCart = () => {
    fetch(`/api/cart/add/${bookId}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch(async (err) => {
        const res = await err.json();
        alert(res.message);
      });
  };

  const submitComment = () => {
    if (!newComment.trim()) return;
    fetch(`/api/comment/${bookId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setNewComment("");
        fetch(`/api/comment/list/${bookId}`)
          .then((res) => res.json())
          .then((data) =>
            setComments(
              data.comments.sort(
                (a, b) => new Date(b.time) - new Date(a.time)
              )
            )
          );
      })
      .catch(() => alert("Hãy đăng nhập trước!"));
  };

  const openEditModal = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const closeEditModal = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const saveEditedComment = () => {
    if (!editingCommentContent.trim() || !editingCommentId) return;

    fetch("/api/comment/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingCommentId,
        content: editingCommentContent.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        closeEditModal();
        fetch(`/api/comment/list/${bookId}`)
          .then((res) => res.json())
          .then((data) =>
            setComments(
              data.comments.sort(
                (a, b) => new Date(b.time) - new Date(a.time)
              )
            )
          );
      })
      .catch(() => alert("Lỗi khi chỉnh sửa bình luận!"));
  };

  const deleteComment = (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

    fetch("/api/comment/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        fetch(`/api/comment/list/${bookId}`)
          .then((res) => res.json())
          .then((data) =>
            setComments(
              data.comments.sort(
                (a, b) => new Date(b.time) - new Date(a.time)
              )
            )
          );
      })
      .catch(() => alert("Lỗi khi xóa bình luận!"));
  };

  const toggleActionMenu = (commentId) => {
    Object.entries(actionMenuRefs.current).forEach(([key, el]) => {
      if (key === String(commentId)) {
        el.style.display = el.style.display === "block" ? "none" : "block";
      } else {
        el.style.display = "none";
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      Object.values(actionMenuRefs.current).forEach(
        (el) => (el.style.display = "none")
      );
    };
    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleActionClick = (e) => {
    e.stopPropagation();
  };

  const goBack = () => {
    if (document.referrer) window.location.href = document.referrer;
    else window.location.href = "/home";
  };

  if (!book) return <div>Đang tải dữ liệu...</div>;

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

      <h2 className={accountStyles["title-bookDetail"]}>
        Chi tiết sách
      </h2>

      <a
        href="#"
        className={accountStyles["back-btn"]}
        onClick={goBack}
      >
        Back
      </a>

      <div className={accountStyles["profile-container"]}>
        {/* container chính */}
        <div className={accountStyles["profile-card"]}>
          {/* card chính */}
          <img
            id="bookImage"
            src={`http://localhost:8080${book.imageUrl}`}
            alt={book.bookName}
            className={accountStyles.bookImage}
          />
          <div className={accountStyles["info-container"]}>
            {/* chứa thông tin và nút */}
            <div className={accountStyles.info}>
              {/* thông tin sách */}
              <p>
                <strong>Tên:</strong> {book.bookName}
              </p>
              <p>
                <strong>Tác giả:</strong> {book.author}
              </p>
              <p>
                <strong>Nhà xuất bản:</strong> {book.publisher}
              </p>
              <p>
                <strong>Năm xuất bản:</strong> {book.yearOfpublication}
              </p>
              <p>
                <strong>Số lượng:</strong> {book.availableQuantity}
              </p>
              <p>
                <strong>Mô tả:</strong> {book.describe}
              </p>
            </div>
            <div className={accountStyles["button-group"]}>
              {/* nhóm nút */}
              <button className={accountStyles.btn} onClick={addToCart}>
                Thêm vào giỏ
              </button>
              <button className={accountStyles.btn} onClick={toggleFavorite}>
                {isFavorited ? "Bỏ yêu thích" : "Yêu thích"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bình luận section */}
      <div className={commentStyles["comments-container"]}>
        <h3>Bình luận</h3>

        {currentUser ? (
          <div className={commentStyles["add-comment"]}>
            <textarea
              id="commentContent"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập bình luận..."
            />
            <button id="submitComment" onClick={submitComment}>
              Gửi
            </button>
          </div>
        ) : (
          <div>
            Vui lòng <a href="/login">đăng nhập</a> để bình luận.
          </div>
        )}

        {comments.length === 0 && <div>Chưa có bình luận nào.</div>}

        <div id="comments-list">
          {comments.map((cmt) => (
            <div
              key={cmt.id}
              className={commentStyles["comment-item"]}
              data-id={cmt.id}
            >
              <div className={commentStyles["comment-header"]}>
                <p>
                  <strong>{cmt.username}</strong> -{" "}
                  {formatDateTime(cmt.time)}
                </p>
                {currentUser && currentUser.id === cmt.userId && (
                  <div
                    className={commentStyles["comment-action"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActionMenu(cmt.id);
                    }}
                  >
                    ⋮
                    <div
                      ref={(el) => (actionMenuRefs.current[cmt.id] = el)}
                      className={commentStyles["action-menu"]}
                      onClick={handleActionClick}
                    >
                      <button onClick={() => openEditModal(cmt)}>
                        Sửa
                      </button>
                      <button onClick={() => deleteComment(cmt.id)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p>{cmt.content}</p>
            </div>
          ))}
        </div>
      </div>

      {editingCommentId && (
        <div
          id="editCommentModal"
          className={commentStyles.modal}
          onClick={closeEditModal}
        >
          <div
            className={commentStyles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className={commentStyles.close}
              onClick={closeEditModal}
            >
              &times;
            </span>
            <h3>Sửa bình luận</h3>
            <textarea
              id="editCommentContent"
              value={editingCommentContent}
              onChange={(e) =>
                setEditingCommentContent(e.target.value)
              }
              placeholder="Nhập nội dung mới..."
            />
            <button
              id="saveEditedComment"
              onClick={saveEditedComment}
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;

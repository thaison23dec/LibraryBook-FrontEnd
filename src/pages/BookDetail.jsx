import { useParams } from "react-router-dom";
import books from "../data/books";
import "../css/BookSection.css";

const BookDetail = () => {
  const { id } = useParams();

  console.log("ID từ URL:", id);
  console.log("Danh sách ID trong books:", books.map((b) => b.id));

  const book = books.find((b) => b.id === id);

  if (!book) return <div> Không tìm thấy sách.</div>;

  return (
    <div className="book-detail-container" style={{ padding: "1rem" }}>
      <h1 className="book-title">{book.title}</h1>
      <p className="book-author">Tác giả: {book.author}</p>
      <p className="book-description">Mô tả: {book.description}</p>
    </div>
  );
};

export default BookDetail;

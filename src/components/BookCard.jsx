// src/components/BookCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../css/BookCard.css";

const BookCard = ({id,  title, author }) => {
  return (
    <div className="book-card">
      <div className="book-cover">Ảnh</div>
      <div className="book-info">
        <Link to={`/books/${id}`} className="book-title">{title}</Link>
        <div className="book-author">{author}</div>
      </div>
      <button className="borrow-btn">Mượn sách</button>
    </div>
  );
};

export default BookCard;

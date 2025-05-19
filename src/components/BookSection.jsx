import "../css/BookSection.css";
import BookCard from "./BookCard";
import { Link } from "react-router-dom"; 

const BookSection = ({ title, books }) => {
  return (
    <div className="book-section">
      <h2 className="section-title">
        <a href="#" className="section-link">{title}</a>
      </h2>
      <div className="book-slider-wrapper">
        <div className="book-slider">
          {books.map((book, index) => (
            <Link key={book.id} to={`/books/${book.id}`}> 
              <BookCard key={index} id={book.id} title={book.title} author={book.author} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookSection;

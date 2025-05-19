import React from "react";
import "../css/Home.css";
import BookSection from "../components/BookSection";
import books from "../data/books"; 

function Home() {

  const bookGenres = [
    { title: "Khoa Học", books: books },
    { title: "Tiểu Thuyết", books: books },
    { title: "Lịch Sử", books: books },
  ];

  return (
    <div className="home-wrapper">
      <div className="home-container">
        {bookGenres.map((genre, index) => (
          <BookSection key={index} title={genre.title} books={genre.books} />
        ))}
      </div>
    </div>
  );
}

export default Home;

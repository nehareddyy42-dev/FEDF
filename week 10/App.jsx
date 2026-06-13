import { useState } from "react";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Books from "./components/Books";
import RecycleBin from "./components/RecycleBin";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");

  const [books, setBooks] = useState([
    { id: 1, title: "Data Structures and Algorithms", author: "Mark Allen Weiss" },
    { id: 2, title: "Computer Networks", author: "Andrew S. Tanenbaum" },
    { id: 3, title: "Atomic Habits", author: "James Clear" },
    { id: 4, title: "The Alchemist", author: "Paulo Coelho" },
    { id: 5, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" },
    { id: 6, title: "Harry Potter", author: "J.K. Rowling" },
    { id: 7, title: "Charlie and the Chocolate Factory", author: "Roald Dahl" },
    { id: 8, title: "Sherlock Holmes", author: "Arthur Conan Doyle" },
    { id: 9, title: "The Hobbit", author: "J.R.R. Tolkien" },
    { id: 10, title: "Wings of Fire", author: "A.P.J. Abdul Kalam" }
  ]);

  const [deletedBooks, setDeletedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const moveToRecycleBin = async (book) => {
    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );

    setBooks(
      books.filter((b) => b.id !== book.id)
    );

    setDeletedBooks([
      ...deletedBooks,
      book
    ]);

    setLoading(false);

    setMessage(
      `"${book.title}" deleted successfully`
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const restoreBook = (book) => {
    setDeletedBooks(
      deletedBooks.filter(
        (b) => b.id !== book.id
      )
    );

    setBooks([...books, book]);
  };

  const permanentDelete = (id) => {
    setDeletedBooks(
      deletedBooks.filter(
        (book) => book.id !== id
      )
    );
  };

  if (!isLoggedIn) {
    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  return (
    <div className="app">
      <Navbar
        setPage={setPage}
        setIsLoggedIn={setIsLoggedIn}
      />

      <div className="main-content">

        {page === "dashboard" && (
          <Dashboard
            books={books}
            deletedBooks={deletedBooks}
          />
        )}

        {page === "books" && (
          <Books
            books={books}
            moveToRecycleBin={moveToRecycleBin}
            loading={loading}
            message={message}
          />
        )}

        {page === "recycle" && (
          <RecycleBin
            deletedBooks={deletedBooks}
            restoreBook={restoreBook}
            permanentDelete={permanentDelete}
          />
        )}

      </div>
    </div>
  );
}

export default App;
import { useState } from "react";

function AddBook() {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [message, setMessage] = useState("");

  const [books, setBooks] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBook = {
      title: bookTitle,
      author: author,
      isbn: isbn,
    };

    setBooks([...books, newBook]);

    setMessage(
      `Book Added Successfully: ${bookTitle} by ${author}`
    );

    setBookTitle("");
    setAuthor("");
    setIsbn("");
  };

  const deleteBook = (index) => {
    const updatedBooks = books.filter(
      (_, i) => i !== index
    );
    setBooks(updatedBooks);
  };

  return (
    <div className="container">
      <h2>Add New Book</h2>

      <form onSubmit={handleSubmit}>
        <label>Book Title</label>
        <input
          type="text"
          value={bookTitle}
          onChange={(e) =>
            setBookTitle(e.target.value)
          }
          placeholder="Enter Book Title"
          required
        />

        <label>Author Name</label>
        <input
          type="text"
          value={author}
          onChange={(e) =>
            setAuthor(e.target.value)
          }
          placeholder="Enter Author Name"
          required
        />

        <label>ISBN Number</label>
        <input
          type="text"
          value={isbn}
          onChange={(e) =>
            setIsbn(e.target.value)
          }
          placeholder="Enter ISBN"
          required
        />

        <button type="submit">
          Add Book
        </button>
      </form>

      {message && (
        <div className="success">
          {message}
        </div>
      )}

      {/* Book List */}

      <div className="book-list">
        <h2>Book Records</h2>

        {books.length === 0 ? (
          <p>No books added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteBook(index)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AddBook;
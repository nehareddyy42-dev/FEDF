function Books({
  books,
  moveToRecycleBin,
  loading,
  message
}) {
  return (
    <div>
      <h1>Available Books</h1>

      {loading && (
        <h3 className="loading">
          Moving Book To Recycle Bin...
        </h3>
      )}

      {message && (
        <h3 className="success-message">
          {message}
        </h3>
      )}

      <div className="books-grid">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card"
          >
            <h3>{book.title}</h3>

            <p>
              Author: {book.author}
            </p>

            <button
              className="delete-btn"
              onClick={() =>
                moveToRecycleBin(book)
              }
            >
              Delete
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
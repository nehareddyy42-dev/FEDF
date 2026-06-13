function Dashboard({
  books,
  deletedBooks
}) {

  const recentBooks =
    books.slice(0, 4);

  return (
    <div>

      <div className="dashboard-header">

        <h1>
          Welcome Back Librarian 👋
        </h1>

        <p>
          Manage your library
          books efficiently.
        </p>

      </div>

      <div className="stats">

        <div className="card">
          <h2>{books.length}</h2>
          <p>Available Books</p>
        </div>

        <div className="card">
          <h2>{deletedBooks.length}</h2>
          <p>Deleted Books</p>
        </div>

        <div className="card">
          <h2>
            {books.length +
              deletedBooks.length}
          </h2>
          <p>Total Collection</p>
        </div>

      </div>

      <div className="dashboard-sections">

        <div className="recent-section">

          <h2>📖 Recently Added</h2>

          {
            recentBooks.map((book) => (
              <div
                key={book.id}
                className="recent-book"
              >
                <strong>
                  {book.title}
                </strong>
                <p>
                  {book.author}
                </p>
              </div>
            ))
          }

        </div>

        <div className="quote-section">

          <h2>✨ Quote of the Day</h2>

          <p>
            "A room without books
            is like a body
            without a soul."
          </p>

          <span>
            — Marcus Tullius Cicero
          </span>

        </div>

      </div>

      <div className="category-section">

        <h2>📚 Library Categories</h2>

        <div className="categories">

          <div className="category-box">
            Academic
          </div>

          <div className="category-box">
            Fiction
          </div>

          <div className="category-box">
            Kids
          </div>

          <div className="category-box">
            Best Sellers
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
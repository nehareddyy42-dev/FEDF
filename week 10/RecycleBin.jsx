function RecycleBin({
  deletedBooks,
  restoreBook,
  permanentDelete
}) {

  return (
    <div>

      <h1>Recycle Bin</h1>

      {
        deletedBooks.length === 0 ?

          (
            <h3>
              No Deleted Books
            </h3>
          )

          :

          (
            <div className="books-grid">

              {
                deletedBooks.map(
                  (book) => (

                    <div
                      key={book.id}
                      className="book-card"
                    >

                      <h3>
                        {book.title}
                      </h3>

                      <p>
                        Author:
                        {book.author}
                      </p>

                      <button
                        className="restore-btn"
                        onClick={() =>
                          restoreBook(book)
                        }
                      >
                        Restore
                      </button>

                      <button
                        className="permanent-btn"
                        onClick={() =>
                          permanentDelete(
                            book.id
                          )
                        }
                      >
                        Delete Forever
                      </button>

                    </div>

                  )
                )
              }

            </div>
          )
      }

    </div>
  );
}

export default RecycleBin;
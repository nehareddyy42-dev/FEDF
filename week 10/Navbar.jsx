function Navbar({
  setPage,
  setIsLoggedIn
}) {

  return (
    <div className="sidebar">

      <h2>📚 Library</h2>

      <button
        onClick={() =>
          setPage("dashboard")
        }
      >
        Dashboard
      </button>

      <button
        onClick={() =>
          setPage("books")
        }
      >
        Books
      </button>

      <button
        onClick={() =>
          setPage("recycle")
        }
      >
        Recycle Bin
      </button>

      <button
        className="logout-btn"
        onClick={() =>
          setIsLoggedIn(false)
        }
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;
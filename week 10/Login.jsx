function Login({ setIsLoggedIn }) {

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>📚 Library Management System</h1>

        <p>
          Smart Recycle Bin Dashboard
        </p>

        <button
          className="login-btn"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;
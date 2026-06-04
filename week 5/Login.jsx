import React, { useState } from 'react';
function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const [emailError, setEmailError] = useState('');
const [passwordError, setPasswordError] = useState('');
const handleLogin = (e) => {
e.preventDefault();
setEmailError('');
setPasswordError('');
setMessage('');
let valid = true;
// Email Validation
if (email === '') {
setEmailError('Email is required');
valid = false;
}
else if (!email.includes('@')) {
setEmailError('Enter valid email');
valid = false;
}
// Password Validation
if (password === '') {
setPasswordError('Password is required');
valid = false;
}
else if (password.length < 6) {
setPasswordError('Password must be 6 characters');
valid = false;
}
// Login Simulation
if (valid) {
if (
email === 'harshika@klh.edu.in' &&
password === '123456'
) {
setMessage('Login Successful');
}
else {
setMessage('Invalid Email or Password');
}
}
};
return (
<div className="login-container">
<form className="login-form" onSubmit={handleLogin}>
<h2>University ERP Login</h2>
<input
type="text"
placeholder="Enter Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
<p className="error">{emailError}</p>
<input
type="password"
placeholder="Enter Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
<p className="error">{passwordError}</p>
<button type="submit">
Login
</button>
<p className="message">{message}</p>
</form>
</div>
);
}
export default Login;
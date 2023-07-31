// Login.js
import React from 'react';

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <input type="text" placeholder="userId" />
        <input type="password" placeholder="password" />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

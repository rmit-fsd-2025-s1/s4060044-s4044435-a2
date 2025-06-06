import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, SetError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      SetError("Username and password are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5050/login", {
        email,
        password,
      });

      const user = res.data.user;
      const token = res.data.token;

      if (!user || !token) {
        SetError("Login failed: user not found.");
        return;
      }

      if (user.isBlocked) {
        SetError("Your account has been blocked. Please contact admin.");
        return;
      }

      // Store token in session and user info in localStorage (used in Navbar)
      sessionStorage.setItem("token", token);
      localStorage.setItem("loggedIn", JSON.stringify(user));
      alert(`Welcome ${user.name}`);
      router.push("/home");

    } catch (err) {
      const error = err as AxiosError;
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        SetError("Invalid email or password.");
      } else {
        SetError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <p className="login-subtitle"><b>Sign in to your account</b></p>

        <div className="input-group">
          <span className="icon">📧</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>SIGN IN</button>
        {error && <p className="login-error">{error}</p>}

        <p className="login-switch">
          Don’t have an account? <Link href="/signup">Create</Link>
        </p>
      </div>

      <div className="login-right">
        <h2 className="welcome-title">Welcome Back!</h2>
        <p className="welcome-text">
          Welcome Back! Access your account and manage your activities seamlessly. We&apos;re here to assist you!
        </p>
      </div>
    </div>
  );
}

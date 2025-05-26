import { useState } from "react";
import { useRouter } from "next/router";


export default function LoginForm() {
const personImg = "/images/bgo.png"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Handling login function
  const handleLogin = (e:React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    if (username === "admin" && password === "admin") {
      sessionStorage.setItem("adminAuth", "true");
      router.push("/admin-dashboard");
    } else {
    // Setting the states to empty if wrong
      setUsername("");
      setPassword("");
      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="illustration-section">
          <div className="illustration-content">
            <div className="person">
                <img src = {personImg}  alt="A person coding" />
            </div>
            <h2 className="title">TeachTeam Admin Page</h2>
            <p className="subtitle">
              Assign Lecturers to Their Respective Courses
            </p>
          </div>
        </div>

        <div className="form-section">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-text">Teach</span>
              <span className="logo-hub">Team</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                className="form-input"
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="sign-in-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

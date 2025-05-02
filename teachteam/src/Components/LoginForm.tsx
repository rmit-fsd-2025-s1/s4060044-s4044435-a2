import { useState } from "react";
import { useRouter } from "next/router";

// setting up useStates
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, SetError] = useState("");
  const router = useRouter();

  // Handling login function
  const handleLogin = () => {
    // Setting Error
    if (!email || !password) {
      SetError("Username and password are required.");
      return;
    }

    // Getting user from the local storage
    const users: { email: string; password: string }[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    // Finding the email and password entered
    const user = users.find((u) => u.email == email && u.password == password);

    if (user) {
      // If user found routing to homePage
      localStorage.setItem("loggedIn", JSON.stringify(user));
      alert("Logged In");
      router.push("/home");
    } else {
      // otherwise showing error
      SetError("Invalid Username or Password.");
    }
  };
  return (
    <div className="login-container">
      <div className="login-left">
        <p className="login-subtitle">
          {/*login - box leftside*/}
          <b>Sign in to your account</b>
        </p>
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
        <button className="login-btn" onClick={handleLogin}>
          SIGN IN
        </button>
        {error && <p className="login-error">{error}</p>}
        <p className="login-switch">
          Don’t have an account? <a href="/signup">Create</a>
        </p>
      </div>
      {/* Login side right*/}
      <div className="login-right">
        <h2 className="welcome-title">Welcome Back!</h2>
        <p className="welcome-text">
          Welcome Back! Access your account and manage your activities
          seamlessly. We're here to assist you!
        </p>
      </div>
    </div>
  );
}


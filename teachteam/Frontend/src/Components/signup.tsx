import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

//state hooks
export default function SignupForm() {
  const [name,setName] = useState("");
  const [email, setEmail] = useState("");//email field
  const [password, setPassword] = useState("");//password field
  const [confirmPassword, setConfirmPassword] = useState("");//confirm password
  const [role, setRole] = useState("");
  const [error, setError] = useState(""); //error message
  const router = useRouter();
 
  // ensures field are filled
  const handleSignup = async () => {
    if (!name ||!email || !password || !confirmPassword || !role) {
      setError("All fields are required.");
      return;
    }
    // using proper format for the email, checks the pattern weather it is correct
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation (at least 1 uppercase, 1 number, 1 symbol, and 8 characters)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character." //password strength
      );
      return;
    }

    // Confirm password it checks if both field match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Will be saving our data to cloud mySql
    try{
      await axios.post("http://localhost:5050/signup",{
        name,
        email,
        password,
        role
      })

      alert("Signup successful!");
      router.push("/login")
    } // Error handling
    catch (err: any) {
      console.error("Signup failed:", err);
      console.log("Full Axios response:", err.response);
      setError(err.response?.data?.error || "Signup failed");
    }
    
  }

  // structure for entering signup details like email and  password
  return (
    <div className="signup-container">
      <div className="signup-left">
        <p className="signup-subtitle">
          <b>Create your account</b>
        </p>
        {/* NAME FIELD  Newly Added*/}
        <div className="input-group">
          <span className="icon">👤</span>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
          />
        </div>
        <div className="input-group">
          <span className="icon">📧</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
          />
        </div>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />
        </div>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signup-input"
          />
        </div>
        {/* selecting role during signup */}
        <div className="input-group">
          <span className="icon">🎓</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="signup-input"
          >
            <option value="">Select Role</option>
            <option value="Tutor">Tutor</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>
        {/* click signup button */}
        <button className="signup-btn" onClick={handleSignup}>
          SIGN UP
        </button>
        {/* shows error message */}
        {error && <p className="signup-error">{error}</p>}
        <p className="signup-switch">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
      {/* welcome message for right side */}
      <div className="signup-right">
        <h2 className="welcome-title">Join Us!</h2>
        <p className="welcome-text">
          Sign up and start managing your activities with ease. We’re excited to have you on board!
        </p>
      </div>
    </div>
  );
}
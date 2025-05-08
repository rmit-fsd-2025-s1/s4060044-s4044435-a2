import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// setting up useStates
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, SetError] = useState("");
  const router = useRouter();

  // Handling login function
  const handleLogin = async() => {
    // Setting Error
    if (!email || !password) {
      SetError("Username and password are required.");
      return;
    }

    // Getting user from MySql Cloud
    try{
      const res = await axios.post("http://localhost:5050/login",{
        email,
        password
      })
      const user = res.data.user;
      const token = res.data.token
      
    if(!user || !token){
      SetError("Login failed: user not found")
      return;
    }
    // Assigning the token created which will be created in login controller uopn successfull login
      localStorage.setItem("token",token);
      alert(`Welcome ${user.name}`);
      router.push("/home");
      // Catch Block for proper error handling
      // Error will come from the controller in the backend
    }catch(err:any){
      if(err.response?.status === 401){
        SetError("Invalid email or password")
      }else{
        SetError("Something went wrong. Please try again.")
      }
    }
  }
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


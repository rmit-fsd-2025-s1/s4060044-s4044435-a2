import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

// Creating an User interface
interface User {
  name: String;
  email: String;
  role: String;
  joinedAt: Date;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Fetching data from token in local storage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You Must login to view this page");
      router.push("/login");
      return;
    }

    try {
        // decoding the token and retrieving the data of my User
      const decoded: any = jwtDecode(token);
      
      setUser({
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        joinedAt: decoded.joinedAt
      });
      // catching error if someone try to access /profile without login
    } catch (err) {
      console.error("Invalid token", err);
     // removing token from session storage
      sessionStorage.removeItem("token");
      router.push("/login");
    }
  }, []);
// if no user return null {just for an edge case validation has already been done in backend} else return the details
if(!user) {
    return null
} else{
    return (
    <div className="profile-container">
      <h2 className="profile-title">👤 Profile</h2>
      <div className="profile-field">Name: <b>{user.name}</b></div>
      <div className="profile-field">Email: <b>{user.email}</b></div>
      <div className="profile-field">Role: <b>{user.role}</b></div>
      <div className = "profile-field">Date Joined: <b>{new Date(user.joinedAt).toLocaleDateString()}</b></div>
    </div>
  );
}
}

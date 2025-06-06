import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

// Creating a User interface
interface User {
  name: string;
  email: string;
  role: string;
  joinedAt: Date;
}

interface DecodedToken {
  name: string;
  email: string;
  role: string;
  joinedAt: string; // token stores date as string
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
      const decoded = jwtDecode<DecodedToken>(token);

      setUser({
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        joinedAt: new Date(decoded.joinedAt),
      });
    } catch (err) {
      console.error("Invalid token", err);
      sessionStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return null;
  } else {
    return (
      <div className="profile-container">
        <h2 className="profile-title">👤 Profile</h2>
        <div className="profile-field">
          Name: <b>{user.name}</b>
        </div>
        <div className="profile-field">
          Email: <b>{user.email}</b>
        </div>
        <div className="profile-field">
          Role: <b>{user.role}</b>
        </div>
        <div className="profile-field">
          Date Joined: <b>{user.joinedAt.toLocaleDateString()}</b>
        </div>
      </div>
    );
  }
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// Props or arguments that should be in our user object
interface User {
  email: string;
  role: "tutor" | "lecturer";
}

export default function Navbar() {
  // Tracking the loggedIn  user and mobile menu state
  const [user, setUser] = useState({ email: "", role: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // fetching user from local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedIn") || "null");
    setUser(storedUser);
  }, []);

  // signOut handler
  const handleSignOut = () => {
    localStorage.removeItem("loggedIn");
    setUser({ email: "", role: "" });
    alert("Logged out");
    router.push("/login");
  };
  return (
    <nav className="navbar">
      <div className="nav-conatiner">
        {/* Hamburger icon for mobile menu toggle */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        {/* Navigation links, shown conditionally based on user role */}
        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          <li>
            <Link href="/home">Home</Link>
          </li>
          {/* Show Tutor-specific link */}
          {user?.role === "Tutor" && (
            <li>
              <Link href="/tutorPage">Tutors</Link>
            </li>
          )}
          {/* Show Lecturer-specific link */}
          {user?.role === "Lecturer" && (
            <li>
              <Link href="/lecturers">Lecturers</Link>
            </li>
          )}
          {/*Auth Section*/}
          {user.email ? (
            <>
              <li>
                <button onClick={handleSignOut} className="signout-btn">
                  Sign Out
                </button>
              </li>
              <li className="user-email">{user.email}</li>
            </>
          ) : (
            <li>
              <Link href="/login" className="signin-btn">
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

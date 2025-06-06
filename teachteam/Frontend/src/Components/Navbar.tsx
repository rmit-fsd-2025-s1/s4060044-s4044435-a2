import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

// Props or arguments that should be in our user object
interface User {
  email: string;
  role: "Tutor" | "Lecturer";
}

interface DecodedToken {
  email: string;
  role: "Tutor" | "Lecturer";
}

export default function Navbar() {
  // Tracking the loggedIn  user and mobile menu state
  const [user, setUser] = useState<User | null>(null); // can set user as null now for logout
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // loading user from jwt token in localstorage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decode = jwtDecode<DecodedToken>(token);
      setUser({ email: decode.email, role: decode.role });
    }
  }, []);

  // signOut handler
  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    setUser(null);
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
          {user ? (
            <>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <div>
                <button onClick={handleSignOut} className="signout-btn">
                  Sign Out
                </button>
              </div>
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

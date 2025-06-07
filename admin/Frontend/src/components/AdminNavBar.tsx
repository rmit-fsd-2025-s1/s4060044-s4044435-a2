import Link from "next/link";
import { useRouter } from "next/router";
//import "../styles/AdminNavBar.css"; // ✅ Make sure CSS is loaded

export default function AdminNavBar() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    alert("Logged out.");
    router.push("/loginForm");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        <span className="admin-navbar-brand">Admin Dashboard</span>
        <ul className="admin-navbar-links">
          <li>
            <Link href="/AdminReport">Report Section</Link>
          </li>
          <li>
            <Link href="/admindashboard">Admin Dashboard</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="admin-logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default function AdminDashboardComponent({ assignLecturer, blockCandidate, editCourse }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Welcome, Admin</h2>
          <p className="dashboard-subtitle">Manage courses, lecturers, and tutor candidates</p>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">📘 Course Management</h3>
          <button className="dashboa rd-btn" onClick={editCourse}>
            ➕ Add / ✏️ Edit / ❌ Delete Course
          </button>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">🧑‍🏫 Assign Lecturer</h3>
          <button className="dashboard-btn" onClick={assignLecturer}>
            🔁 Assign Lecturer to Course
          </button>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">🚫 Candidate Control</h3>
          <button className="dashboard-btn" onClick={blockCandidate}>
            Toggle Block / Unblock Candidate
          </button>
        </div>
      </div>
    </div>
  );
}
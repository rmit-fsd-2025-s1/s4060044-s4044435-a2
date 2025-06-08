import dynamic from "next/dynamic";
import AdminNavBar from "./AdminNavBar";

// Dynamically import the subcomponents to avoid SSR issues if needed
const CourseManager = dynamic(() => import("../components/CourseManager"));
const LecturerAssignment = dynamic(() => import("../components/LecturerAssignment"));
const CandidateManager = dynamic(() => import("../components/CandidateManager"));

interface AdminDashboardProps {
  assignLecturer: () => void;
  editCourse: () => void;
  blockCandidate: () => void;
}

export default function AdminDashboardComponent({}: AdminDashboardProps) {
  return (
    <>
      <AdminNavBar />
      <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Welcome, Admin</h2>
          <p className="dashboard-subtitle">Manage courses, lecturers, and tutor candidates</p>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">📘 Course Management</h3>
          <CourseManager />
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">🧑‍🏫 Assign Lecturer</h3>
          <LecturerAssignment />
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">🚫 Candidate Control</h3>
          <CandidateManager />
        </div>
        </div>
      </div>
    </>
  );
}
import AdminNavBar from "@/components/AdminNavBar";
import { gql, useQuery } from "@apollo/client";
// import "../styles/admin-reports.css"; // ✅ link to your matching CSS file

// Interfaces
interface User {
  name: string;
  email: string;
}

interface Candidate {
  candidateId: number;
  user: User;
}

interface Course {
  courseCode: string;
  courseName: string;
}

interface CourseWithChosenCandidates {
  course: Course;
  candidates: Candidate[];
}

// GraphQL Query
const GET_SELECTED_REPORTS = gql`
  query {
    selectedCandidatesPerCourse {
      course {
        courseCode
        courseName
      }
      candidates {
        candidateId
        user {
          name
          email
        }
      }
    }

    overSelectedCandidates {
      candidateId
      user {
        name
        email
      }
    }

    unselectedCandidates {
      candidateId
      user {
        name
        email
      }
    }
  }
`;

export default function AdminReportsPage() {
  const { data, loading, error } = useQuery<{
    selectedCandidatesPerCourse: CourseWithChosenCandidates[];
    overSelectedCandidates: Candidate[];
    unselectedCandidates: Candidate[];
  }>(GET_SELECTED_REPORTS);

  return (
    <>
      <AdminNavBar />
      <div className="admin-reports-container">
        <div className="admin-reports-card">
          <h2 className="admin-reports-title">📊 Admin Reports (Based on Lecturer Selections)</h2>

          {loading && <p>Loading reports...</p>}
          {error && <p>Error loading reports: {error.message}</p>}

          {data && (
            <>
              {/* Report 1 */}
              <div className="report-block">
                <h3>✅ Candidates Chosen per Course</h3>
                {data.selectedCandidatesPerCourse.map((entry) => (
                  <div key={entry.course.courseCode} style={{ marginBottom: "15px" }}>
                    <strong>
                      {entry.course.courseCode} - {entry.course.courseName}
                    </strong>
                    {entry.candidates.length === 0 ? (
                      <p>No candidates selected.</p>
                    ) : (
                      <ul>
                        {entry.candidates.map((cand) => (
                          <li key={cand.candidateId}>
                            {cand.user.name} ({cand.user.email})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Report 2 */}
              <div className="report-block">
                <h3>⚠️ Candidates Selected in More Than 3 Courses</h3>
                {data.overSelectedCandidates.length === 0 ? (
                  <p>No candidates selected in more than 3 courses.</p>
                ) : (
                  <ul>
                    {data.overSelectedCandidates.map((cand) => (
                      <li key={cand.candidateId}>
                        {cand.user.name} ({cand.user.email})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Report 3 */}
              <div className="report-block">
                <h3>❌ Candidates Not Selected for Any Course</h3>
                {data.unselectedCandidates.length === 0 ? (
                  <p>All candidates have been selected in at least one course.</p>
                ) : (
                  <ul>
                    {data.unselectedCandidates.map((cand) => (
                      <li key={cand.candidateId}>
                        {cand.user.name} ({cand.user.email})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

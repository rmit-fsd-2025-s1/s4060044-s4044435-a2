// pages/AdminReports.tsx
import AdminNavBar from "@/components/AdminNavBar";
import ReportSection from "@/components/ReportSection";
import { gql, useQuery } from "@apollo/client";

// Define required interfaces to avoid 'any' usage
interface User {
  name: string;
  email: string;
}

interface Candidate {
  candidateId: number;
  user: User;
}

interface CourseWithCandidates {
  courseCode: string;
  courseName: string;
  candidates: Candidate[];
}

const GET_ADMIN_REPORTS = gql`
  query {
    chosenCandidatesPerCourse {
      courseCode
      courseName
      candidates {
        candidateId
        user {
          name
          email
        }
      }
    }
    candidatesChosenInMoreThanThreeCourses {
      candidateId
      user {
        name
        email
      }
    }
    candidatesNotChosen {
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
    chosenCandidatesPerCourse: CourseWithCandidates[];
    candidatesChosenInMoreThanThreeCourses: Candidate[];
    candidatesNotChosen: Candidate[];
  }>(GET_ADMIN_REPORTS);

  return (
    <>
      <AdminNavBar />
      <div style={{ padding: "40px" }}>
        <h2>📊 Admin Reports</h2>

        {loading && <p>Loading reports...</p>}
        {error && <p>Error loading reports: {error.message}</p>}

        {data && (
          <>
            <ReportSection title="✅ Candidates Chosen per Course">
              {data.chosenCandidatesPerCourse.map((course) => (
                <div key={course.courseCode}>
                  <strong>{course.courseCode} - {course.courseName}</strong>
                  {course.candidates.length === 0 ? (
                    <p>No candidates chosen.</p>
                  ) : (
                    <ul>
                      {course.candidates.map((cand) => (
                        <li key={cand.candidateId}>
                          {cand.user.name} ({cand.user.email})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </ReportSection>

            <ReportSection title="⚠️ Candidates Chosen in More Than 3 Courses">
              {data.candidatesChosenInMoreThanThreeCourses.length === 0 ? (
                <p>No candidates found.</p>
              ) : (
                <ul>
                  {data.candidatesChosenInMoreThanThreeCourses.map((cand) => (
                    <li key={cand.candidateId}>
                      {cand.user.name} ({cand.user.email})
                    </li>
                  ))}
                </ul>
              )}
            </ReportSection>

            <ReportSection title="❌ Candidates Not Chosen in Any Course">
              {data.candidatesNotChosen.length === 0 ? (
                <p>All candidates have been selected in at least one course.</p>
              ) : (
                <ul>
                  {data.candidatesNotChosen.map((cand) => (
                    <li key={cand.candidateId}>
                      {cand.user.name} ({cand.user.email})
                    </li>
                  ))}
                </ul>
              )}
            </ReportSection>
          </>
        )}
      </div>
    </>
  );
}

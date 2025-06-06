import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import PieChart from "../Components/PieChartLect";
import axios, { AxiosError } from "axios";

interface Course {
  courseCode: string;
  courseName: string;
  applications: Application[];
}

//  Application interface to specify the applicant details
interface Application {
  applicationId: number;
  candidateId: number;
  candidateName: string;
  email: string;
  roleType: string;
  courseCode: string;
  availability: string;
  skills: string[];
  academicCredentials: string;
  prevWork: string;
  selected?: boolean;
  rank?: number;
  comment: string;
}

interface User {
  name: string;
  role: string;
}

const LecturerPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [comments, setComments] = useState<Map<string, string>>(new Map());
  const [error, setError] = useState<string>("");
  const [searchName, setSearchName] = useState("");
  const [searchAvailability, setSearchAvailability] = useState("");
  const [searchSkills, setSearchSkills] = useState("");
  const [searchSessionType, setSearchSessionType] = useState(""); // NEW STATE for session type
  const [domLoaded, setDomLoaded] = useState(false); //Hydration issue i.e server side render doesn't match the client side render
  const router = useRouter();

  // This will make sure that the code is executed once the page is loaded in the browser
  // Rendering the component when the DOM is loaded
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    // Get the token from sessionStorage (set during login)
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      router.push("/login");
      return;
    }
    // Fetch lecturer data once on page load
    const fetchLecturerData = async () => {
      try {
        // GET request to backend API
        const res = await axios.get("http://localhost:5050/lecturer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data; // response is already parsed JSON
        console.log("Received data:", data);

        // Set the lecturer's name (email is not returned, so leave blank)
        setUser({ name: data.lecturer, role: "Lecturer" });

        // Save course list
        setCourses(data.courses);

        // Flatten all applications
        const allApplicants: Application[] = [];
        data.courses.forEach((course: Course) => {
          course.applications.forEach((app: Application) => {
            allApplicants.push({
              ...app,
              courseCode: course.courseCode,
              selected: app.selected || false,
              rank: app.rank || undefined,
              comment: app.comment || ""
            });
          });
        });
        // Save applicants and initialize comment map
        setApplicants(allApplicants);
        const commentMap = new Map<string, string>();
        allApplicants.forEach((app) => {
          const key = `${app.courseCode}-${app.applicationId}`;
          commentMap.set(key, app.comment || "");
        });
        setComments(commentMap);

      } catch (err) {
        const error = err as AxiosError;
        console.error("Axios fetch failed:", error);
        if (axios.isAxiosError(error) && error.response?.data && typeof error.response.data === "object" && "error" in error.response.data) {
          setError((error.response.data as { error: string }).error);
        } else {
          setError("Unable to load applications.");
        }
      }
    };
    fetchLecturerData(); // call API on page load
  }, [router]);

  // Toggle applicant selection and update backend
  const toggleSelection = async (selectedApp: Application) => {
    const token = sessionStorage.getItem("token");
    const newSelected = !selectedApp.selected;

    try {
      await axios.post("http://localhost:5050/lecturer", {
        candidateId: selectedApp.candidateId,
        courseCode: selectedApp.courseCode,
        comment: selectedApp.comment || "",
        rank: selectedApp.rank || 0,
        selected: newSelected,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // After successful POST, update the frontend state:
      const updatedApplicants = applicants.map((applicant) =>
        applicant.courseCode === selectedApp.courseCode &&
        applicant.candidateId === selectedApp.candidateId
          ? { ...applicant, selected: newSelected }
          : applicant
      );

      setApplicants(updatedApplicants);
    } catch (err) {
      console.error("Selection update failed:", err);
      alert("Failed to update selection on server.");
    }
  };

  // Submit comment if candidat selected
  const handleSubmitComment = async (applicant: Application, comment: string) => {
    if (!applicant.selected) {
      alert("Please select the applicant before submitting the comment.");
      return;
    }

    const token = sessionStorage.getItem("token");

    try {
      await axios.post("http://localhost:5050/lecturer", {
        candidateId: applicant.candidateId,
        courseCode: applicant.courseCode,
        comment,
        rank: applicant.rank || 0,
        selected: true,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Update comment map
      const updated = new Map(comments);
      const commentKey = `${applicant.courseCode}-${applicant.applicationId}`;
      updated.set(commentKey, comment);
      setComments(updated);

      alert("Comment submitted successfully.");
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to submit comment.");
    }
  };

  // DI task graph preparation (Count applicants selected and rank them)
  // Counting how many times each applicant has selected using the accumulator in .reduce()
  const SelectedCount = applicants.reduce<{ [key: string]: number }>(
    (acc, applicant) => {
      if (applicant.selected) {
        const name = applicant.candidateName;
        // If already exists increment by 1
        if (acc[name]) {
          acc[name] = acc[name] + 1;
        } else {
          // else set to 1
          acc[name] = 1;
        }
      }
      return acc; // return the accumulated result
    },
    {} // initial empty object
  );

  // Tracking the most chosen and least chosen
  let mostChosen = { name: "None", count: 0 };
  let leastChosen = { name: "None", count: Infinity };

  //Iterate through selection counts to find extremes
  Object.entries(SelectedCount).forEach(([name, count]) => {
    if (count > mostChosen.count) mostChosen = { name, count };
    if (count < leastChosen.count) leastChosen = { name, count };
  });
  // Filtering out unselected applicants
  const unselectedCount = applicants.filter(
    (applicant) => !applicant.selected
  ).length;

  // Pie chart data for the selection distribution
  const pieChartData = [
    { name: "Most Chosen: " + mostChosen.name, value: mostChosen.count },
    { name: "Least Chosen: " + leastChosen.name, value: leastChosen.count },
    {
      name: "Unselected",
      value: unselectedCount,
    },
  ];

  return (
    domLoaded && (
      <div className="lecturer-page">
        <Navbar />
        {/*Tutor profile display*/}
        <div className="profile-section">
          <h1>Lecturer Page</h1>
          <p>Name: {user?.name}</p>
          <p>Role: {user?.role}</p>
        </div>
        <div className="select-course-section">
          <h2>Select a Course to View Applicants</h2>
          <div className="input-group">
            <label>Select Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="input-field"
            >
              <option value="">Select a Course</option>
              {courses.map((course) => (
                <option key={course.courseCode} value={course.courseCode}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="sort-section">
          <h2 className="sort-title">Sort By:</h2>
          <div className="search-filters">
            <div className="input-group">
              <label>Tutor Name:</label>
              <input
                type="text"
                placeholder="e.g., John"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Availability:</label>
              <select
                value={searchAvailability}
                onChange={(e) => setSearchAvailability(e.target.value)}
                className="input-field"
              >
                <option value="">All</option>
                <option value="Part Time">Part Time</option>
                <option value="Full Time">Full Time</option>
                <option value="Casual">Casual</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="input-group">
              <label>Skills:</label>
              <input
                type="text"
                placeholder="e.g., React, Python"
                value={searchSkills}
                onChange={(e) => setSearchSkills(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Type of Session:</label>
              <select
                value={searchSessionType}
                onChange={(e) => setSearchSessionType(e.target.value)}
                className="input-field"
              >
                <option value="">All</option>
                <option value="Tutor">Tutor</option>
                <option value="Lab Assistant">Lab Assistant</option>
              </select>
            </div>
          </div>
        </div>

        <div className="applicants-section">
          <h2>Applicants for {selectedCourse}</h2>
          {applicants.length > 0 ? (
            applicants
              .filter((applicant) => applicant.courseCode === selectedCourse)
              .filter((applicant) =>
                `${applicant.candidateName}`
                  .toLowerCase()
                  .includes(searchName.toLowerCase())
              )
              .filter((applicant) =>
                searchSessionType === "" || applicant.roleType === searchSessionType
              )
              .map((applicant, index) => (
                <div key={index} className="applicant-card">
                  {/* Displaying applicant's details */}
                  <b>Name:</b> {applicant.candidateName} <br />
                  <b>Email:</b> {applicant.email} <br />
                  <b>Role type:</b> {applicant.roleType} <br />
                  <b>Skills:</b> {applicant.skills + "  "} <br />
                  <b>Availability:</b> {applicant.availability} <br />
                  <b>Academic Credentials:</b>{" "}
                  {applicant.academicCredentials} <br />
                  <b>Previous Work Experience:</b>{applicant.prevWork}<br />
                  {/* Select or Unselect Button */}
                  <button
                    onClick={() => toggleSelection(applicant)}
                    className={
                      applicant.selected
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }
                  >
                    {applicant.selected
                      ? "Unselect Applicant"
                      : "Select Applicant"}
                  </button>
                  {/* Rank Section (Only visible if selected) */}
                  {applicant.selected && (
                    <div className="rank-section">
                      <label>Rank:</label>
                      <input
                        type="number"
                        min={1}
                        value={applicant.rank || ""}
                        onChange={(e) => {
                          const newRank = parseInt(e.target.value, 10);
                          const updatedApplicants = applicants.map((a) =>
                            a.candidateName === applicant.candidateName &&
                            a.courseCode === applicant.courseCode
                              ? {
                                  ...a,
                                  rank: isNaN(newRank) ? undefined : newRank,
                                }
                              : a
                          );
                          setApplicants(updatedApplicants);
                          localStorage.setItem(
                            "userApplications",
                            JSON.stringify(updatedApplicants)
                          );
                        }}
                      />
                    </div>
                  )}
                  {/* Comment Section visible if applicant selected*/}
                  {applicant.selected && (
                    <div className="comment-section">
                      <label>Comment:</label>
                      <textarea
                        value={
                          comments.get(
                            `${applicant.courseCode}-${applicant.candidateName}`
                          ) || ""
                        }
                        onChange={(e) =>
                          setComments((prevComments) => {
                            const updated = new Map(prevComments);
                            updated.set(
                              `${applicant.courseCode}-${applicant.candidateName}`,
                              e.target.value
                            );
                            return updated;
                          })
                        }
                        placeholder="Leave a comment"
                      ></textarea>
                      {/* Submit comment button */}
                      <button
                        onClick={() =>
                          handleSubmitComment(
                            applicant,
                            comments.get(
                              `${applicant.courseCode}-${applicant.candidateName}`
                            ) || ""
                          )
                        }
                      >
                        Submit Comment
                      </button>
                    </div>
                  )}
                  <div className="display-comment-section">
                    <b>Submitted Comment:</b>{" "}
                    {comments.get(
                      `${applicant.courseCode}-${applicant.candidateName}`
                    ) || "No comment yet"}
                  </div>
                </div>
              ))
          ) : (
            <p>No applicants available for this course.</p>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
        <PieChart data={pieChartData}></PieChart>
      </div>
    )
  );
};

export default LecturerPage;

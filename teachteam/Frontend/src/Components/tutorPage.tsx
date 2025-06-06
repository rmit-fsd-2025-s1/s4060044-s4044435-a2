import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios, { AxiosError } from "axios";

// Course type structure
interface Course {
  courseCode: string;
  courseName: string;
}

// Logged in user type structure
interface User {
  name: string;
}

const TutorPage = () => {
  const [user, setUser] = useState<User | null>(null); // current user
  const [courses, setCourses] = useState<Course[]>([]); // available courses
  const [selectedCourse, setSelectedCourse] = useState<string>(""); // selected course
  const [roleType, setRoleType] = useState<string>(""); // tutor or lab assistant
  const [availability, setAvailability] = useState<string>(""); // availability type
  const [availableDays, setAvailableDays] = useState<string[]>([]); // selected days
  const [skills, setSkills] = useState<string>(""); // skill input
  const [academicCredentials, setAcademicCredentials] = useState<string>(""); // academic info
  const [prevWork, setPrevWork] = useState<string>(""); // previous work experience
  const [error, setError] = useState<string>(""); // error message
  const router = useRouter();

  // on component load
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      router.push("/login");
      return;
    }

    // fetch courses from backend
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5050/candidate", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({ name: res.data.name });
        setCourses(res.data.courses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Unable to fetch course list");
      }
    };

    fetchCourses();
  }, [router]);

  // toggle day selection
  const handleDaySelection = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // form submit handler
  const handleSubmit = async () => {
    if (!roleType || !selectedCourse || !availability || !skills || !academicCredentials || !availableDays.length) {
      setError("All fields are required.");
      return;
    }

    const token = sessionStorage.getItem("token");
    try {
      console.log("Token before POST:", token);
      await axios.post(
        "http://localhost:5050/candidate",
        {
          roleType,
          availability,
          skills,
          academicCredentials,
          prevWork,
          courseCode: selectedCourse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Application submitted successfully!");
      setSelectedCourse("");
      setRoleType("");
      setAvailability("");
      setAvailableDays([]);
      setSkills("");
      setAcademicCredentials("");
      setPrevWork("");
      setError("");
    } catch (err) {
      const error = err as AxiosError;
      console.error("Axios error:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Backend error:", error.response.data);
        setError((error.response.data as { error?: string })?.error || "Application failed");
      } else {
        setError("Application failed due to network error");
      }
    }
  };

  return (
    <div className="tutor-page-container">
      <Navbar />
      {/* user profile section */}
      <div className="profile-section">
        <h1>Tutor Page</h1>
        <p>Name: {user?.name}</p>
        <p>Role: Tutor</p>
      </div>

      {/* application form section */}
      <div className="apply-section">
        <h2>Apply for Tutor or Lab Assistant Roles</h2>

        {/* role type */}
        <div className="input-group">
          <label>Role Type:</label>
          <select
            value={roleType}
            onChange={(e) => setRoleType(e.target.value)}
            className="input-field"
          >
            <option value="">Select Role</option>
            <option value="Tutor">Tutor</option>
            <option value="Lab Assistant">Lab Assistant</option>
          </select>
        </div>

        {/* course selection */}
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

        {/* availability */}
        <div className="input-group">
          <label>Availability:</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="input-field"
          >
            <option value="">Select Availability</option>
            <option value="Part Time">Part Time</option>
            <option value="Full Time">Full Time</option>
            <option value="Casual">Casual</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* available days */}
        <div className="input-group">
          <label>Available Days:</label>
          <div className="days-selection">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    value={day}
                    checked={availableDays.includes(day)}
                    onChange={() => handleDaySelection(day)}
                  />
                  {day}
                </label>
              )
            )}
          </div>
        </div>

        {/* skills */}
        <div className="input-group">
          <label>Skills:</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Enter your skills"
            className="input-field"
          />
        </div>

        {/* academic credentials */}
        <div className="input-group">
          <label>Academic Credentials:</label>
          <textarea
            value={academicCredentials}
            onChange={(e) => setAcademicCredentials(e.target.value)}
            placeholder="Enter your academic credentials"
            className="input-field"
          />
        </div>

        {/* previous work */}
        <div className="input-group">
          <label>Previous Work Experience:</label>
          <textarea
            value={prevWork}
            onChange={(e) => setPrevWork(e.target.value)}
            placeholder="Enter previous work"
            className="input-field"
          />
        </div>

        {/* submit button */}
        <button onClick={handleSubmit} className="apply-button">
          Apply
        </button>

        {/* error message */}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default TutorPage;

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";

interface Course {
  courseCode: string;
  courseName: string;
}

const TutorPage = () => {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [roleType, setRoleType] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [skills, setSkills] = useState<string>("");
  const [academicCredentials, setAcademicCredentials] = useState<string>("");
  const [prevWork, setPrevWork] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      router.push("/login");
      return;
    }

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

  const handleDaySelection = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

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
    } catch (err: any) {
      console.error("Axios error:", err);
      if (err.response) {
        console.error("Backend error:", err.response.data);
        setError(err.response.data.error || "Application failed");
      } else {
        setError("Application failed due to network error");
      }
    }
  };

  return (
    <div className="tutor-page-container">
      <Navbar />
      <div className="profile-section">
        <h1>Tutor Page</h1>
        <p>Name: {user?.name}</p>
        <p>Role: Tutor</p>
      </div>

      <div className="apply-section">
        <h2>Apply for Tutor or Lab Assistant Roles</h2>

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

        <div className="input-group">
          <label>Skills:</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Enter your skills"
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label>Academic Credentials:</label>
          <textarea
            value={academicCredentials}
            onChange={(e) => setAcademicCredentials(e.target.value)}
            placeholder="Enter your academic credentials"
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label>Previous Work Experience:</label>
          <textarea
            value={prevWork}
            onChange={(e) => setPrevWork(e.target.value)}
            placeholder="Enter previous work"
            className="input-field"
          />
        </div>

        <button onClick={handleSubmit} className="apply-button">
          Apply
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default TutorPage;
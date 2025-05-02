import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";

// interface for course, application and user
interface Course {
  code: string;
  name: string;
}

interface Application {
  fname: string;
  lname: string;
  phone: string;
  courseCode: string;
  availability: string;
  skills: string;
  academicCredentials: string;
  availableDays: string[];
}

interface User {
  name: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const TutorPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]); // holds course list
  const [selectedCourse, setSelectedCourse] = useState<string>(""); // stores selected course
  const [availability, setAvailability] = useState<string>(""); // Stores availability
  const [availableDays, setAvailableDays] = useState<string[]>([]); // available days
  const [skills, setSkills] = useState<string>(""); // store entered skills
  const [academicCredentials, setAcademicCredentials] = useState<string>(""); // changed from previousWorkExperience
  const [firstName, setFirstName] = useState<string>(""); // store first name
  const [lastName, setLastName] = useState<string>(""); // stores last name
  const [phoneNumber, setPhoneNumber] = useState<string>(""); //store phone number
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // it takes current user from local storage and check weather user exists
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("loggedIn") || "null");
    if (!currentUser || currentUser.role !== "Tutor") {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    //list of courses
    setCourses([
      { code: "COSC2758", name: "Full Stack Development" },
      { code: "COSC2801", name: "Programming bootcamp 1" },
      { code: "COSC2802", name: "Programming bootcamp 2" },
      { code: "COSC2803", name: "Programming Studio 1" },
      { code: "COSC2804", name: "Programming Studio 2" },
      { code: "MATH2466", name: "Introduction to Mathematics for computing" },
      { code: "COSC1002", name: "Database Systems" },
      { code: "ISY3413", name: "Software Engineering Fundamentals" },
      { code: "INTE2625", name: "Introduction to Cyber Security" },
    ]);
  }, [router]);

  // toggle selected day in array, add if not selected and remove if it already exists
  const handleDaySelection = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    // checks for all fields and prevent from submitting application
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !selectedCourse ||
      !availability ||
      !skills ||
      !academicCredentials ||
      !availableDays.length
    ) {
      setError("All fields are required.");
      return;
    }

    // creating a application data with all tutor input values
    const applicationData: Application = {
      fname: firstName,
      lname: lastName,
      phone: phoneNumber,
      courseCode: selectedCourse,
      availability,
      skills,
      academicCredentials,
      availableDays,
    };

    // it saves application, add the new one and show a message "Application submitted successfully!"
    let userApplications = JSON.parse(localStorage.getItem("userApplications") || "[]");
    userApplications.push(applicationData);
    localStorage.setItem("userApplications", JSON.stringify(userApplications));

    alert("Application submitted successfully!");
  };

  return (
    // display tutor page layout
    <div className="tutor-page-container">
      <Navbar />
      {/* profile section showing the users email and role */}
      <div className="profile-section">
        <h1>Tutor Page</h1>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      <div className="personal-details-section">
        <h2>Personal Details</h2>
        <div className="input-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field"
            placeholder="Enter First Name"
          />
        </div>
        {/* Displays an input field for the tutor */}
        <div className="input-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input-field"
            placeholder="Enter Last Name"
          />
        </div>

        <div className="input-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-field"
            placeholder="Enter Phone Number"
          />
        </div>
        {/* display read only email */}
        <div className="input-group">
          <label>Email Address:</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="input-field"
          />
        </div>
      </div>

      <div className="apply-section">
        <h2>Apply for Tutor or Lab-Assistant Roles</h2>
        {/* display a dropdown for choosing a course */}
        <div className="input-group">
          <label>Select Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="input-field"
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
        {/* dropdown for the tutor to select availabilty */}
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
        {/* Display checkboxes and allows tutor to select multiple available days of week */}
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
        {/* allows user to enter their skills */}
        <div className="input-group">
          <label>Skills:</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Enter your skills"
            className="input-field"
          />
        </div>
        {/* changed from previous work experience to academic credentials */}
        <div className="input-group">
          <label>Academic Credentials:</label>
          <textarea
            value={academicCredentials}
            onChange={(e) => setAcademicCredentials(e.target.value)}
            placeholder="Enter your academic credentials"
            className="input-field"
          />
        </div>
        {/* submit button */}
        <button onClick={handleSubmit} className="apply-button">
          Apply
        </button>
        {/* display error message */}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default TutorPage;

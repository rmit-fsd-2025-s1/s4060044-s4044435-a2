import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import PieChart from "../Components/PieChartLect";

interface Course {
  code: string;
  name: string;
}

//  Application interface to specify the applicant details
interface Application {
  fname: string;
  lname: string;
  phone: string;
  courseCode: string;
  availability: string;
  skills: string;
  previousWorkExperience: string;
  availableDays: string[];
  selected?: boolean;
  rank?: number;
}

interface User {
  name: string;
  email: string;
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
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [domLoaded, setDomLoaded] = useState(false); //Hydration issue i.e server side render doesn't match the client side render

  const router = useRouter();

  // This will make sure that the code is executed once the page is loaded in the browser
  // Rendering the component when the DOM is loaded
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  // Fetching data from localStorage when the page loads
  useEffect(() => {
    const currUser = JSON.parse(localStorage.getItem("loggedIn") || "null");
    if (!currUser || currUser.role !== "Lecturer") {
      router.push("/login");
      return;
    }
    setUser(currUser);

    // Set up courses list (hardcoded in this case)
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

    // getting userApplications from local storage
    const applicationData = JSON.parse(
      localStorage.getItem("userApplications") || "[]"
    );
    setApplicants(applicationData);

    // loading comments
    const storedComments = localStorage.getItem("lecturerComments");
    if (storedComments) {
      const parsed: [string, string][] = JSON.parse(storedComments);
      setComments(new Map<string, string>(parsed));
    }
  }, [router]);

  // Function to toggle the selection of an applicant
  const toggleSelection = (selectedApp: Application) => {
    // creating a unique key for each applicant using their coursecode, fname and lname
    const uniqueCommKey = `${selectedApp.courseCode}-${selectedApp.fname}-${selectedApp.lname}`;
    // creating a new list of applicants with the selection updated
    // using .map() to iterate through each applicant
    const updatedApplicants = applicants.map(
      (applicant) =>
        // Checking if the current applicant matched the one that was clicked
        applicant.courseCode === selectedApp.courseCode &&
        applicant.fname === selectedApp.fname &&
        applicant.lname === selectedApp.lname
          ? // if matches toggle select property to true or false
            { ...applicant, selected: !applicant.selected } // Toggle the selected state
          : applicant // If didn't match return as it is
    );

    setApplicants(updatedApplicants);
    localStorage.setItem("userApplications", JSON.stringify(updatedApplicants));

    // comment for applicant if not already set
    // Checking if the applicant is selected if yes then proceed further
    if (selectedApp.selected) {
      // Checking tif the comment already exists
      if (!comments.has(uniqueCommKey)) {
        // If no then creating a new entry with empty string
        setComments((prevComments) => {
          return new Map(prevComments).set(uniqueCommKey, "");
        });
      }
    }
    // showing wheather the applicant selected or not
    alert(
      `${selectedApp.fname} ${selectedApp.lname} has been ${
        selectedApp.selected ? "unselected" : "selected"
      }`
    );
  };

  // Function to submit the comment for a specific applicant
  const handleSubmitComment = (applicant: Application, comment: string) => {
    // Ensuring only selected applicants have comments submitted
    if (!applicant.selected) {
      alert("Please select the applicant before submitting the comment.");
      return;
    }

    // created a unique key for every applicant
    const uniqueCommKey = `${applicant.courseCode}-${applicant.fname}-${applicant.lname}`;
    // creating a copy of the present one and setting the new ones
    const updatedComments = new Map(comments);
    updatedComments.set(uniqueCommKey, comment);
    // updating state with new comments map
    setComments(updatedComments);

    // Save the updated comments to localStorage
    const Comments = Array.from(updatedComments.entries());
    localStorage.setItem("lecturerComments", JSON.stringify(Comments));

    alert("Comment Submitted");
  };

  // DI task graph preparation (Count applicants selected and rank them)
  // Counting how many times each applicant has selected using the accumulator in .reduce()
  const SelectedCount = applicants.reduce<{ [key: string]: number }>(
    (acc, applicant) => {
      if (applicant.selected) {
        const name = applicant.fname + " " + applicant.lname;
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
          <p>Email: {user?.email}</p>
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
                <option key={course.code} value={course.code}>
                  {course.code} - {course.name}
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
            {/* <div className="input-group">
            <label>Days Available:</label>
            <select
              multiple
              value={selectedDays}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                setSelectedDays(selected);
              }}
              className="input-field"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div> */}
          </div>
        </div>

        <div className="applicants-section">
          <h2>Applicants for {selectedCourse}</h2>
          {applicants.length > 0 ? (
            applicants
              .filter((applicant) => applicant.courseCode === selectedCourse)
              .filter((applicant) =>
                `${applicant.fname} ${applicant.lname}`
                  .toLowerCase()
                  .includes(searchName.toLowerCase())
              )
              .filter((applicant) =>
                applicant.availability
                  .toLowerCase()
                  .includes(searchAvailability.toLowerCase())
              )
              .filter((applicant) =>
                applicant.skills
                  .toLowerCase()
                  .includes(searchSkills.toLowerCase())
              )
              .filter(
                (applicant) =>
                  selectedDays.length === 0 ||
                  selectedDays.every((day) =>
                    applicant.availableDays.includes(day)
                  )
              )
              .map((applicant, index) => (
                <div key={index} className="applicant-card">
                  {/* Displaying applicant's first name, last name, and other details */}
                  <b>Name:</b> {applicant.fname} {applicant.lname} <br />
                  <b>Phone Number:</b> {applicant.phone} <br />
                  <b>Skills:</b> {applicant.skills} <br />
                  <b>Availability:</b> {applicant.availability} <br />
                  <b>Previous Work Experience:</b>{" "}
                  {applicant.previousWorkExperience} <br />
                  <b>Available Days:</b> {applicant.availableDays.join(", ")}{" "}
                  <br />
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
                          // Will take a string but will convert it to int
                          const newRank = parseInt(e.target.value, 10);
                          // update the rank for only the matched element
                          const updatedApplicants = applicants.map((a) =>
                            a.fname === applicant.fname &&
                            a.courseCode === applicant.courseCode
                              ? {
                                  ...a,
                                  rank: isNaN(newRank) ? undefined : newRank,
                                }
                              : a
                          );
                          //saveing updated list to state
                          setApplicants(updatedApplicants);
                          // save it to localstorage
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
                            // getting the comments using the unique key
                            `${applicant.courseCode}-${applicant.fname}-${applicant.lname}`
                          ) || ""
                        }
                        onChange={(e) =>
                          //updating the comment in a copied map
                          setComments((prevComments) => {
                            const updated = new Map(prevComments);
                            updated.set(
                              `${applicant.courseCode}-${applicant.fname}-${applicant.lname}`,
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
                              `${applicant.courseCode}-${applicant.fname}-${applicant.lname}`
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
                      `${applicant.courseCode}-${applicant.fname}-${applicant.lname}`
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

// Import required hooks
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
// import "./course-manager.css";

interface Course { // Define the structure of a course
  courseCode: string;
  courseName: string;
}

// GraphQL query to get all courses

const GET_COURSES = gql`
  query {
    allCourses {
      courseCode
      courseName
    }
  }
`;

const ADD_COURSE = gql`
  mutation($courseCode: String!, $courseName: String!) {
    addCourse(courseCode: $courseCode, courseName: $courseName) {
      courseCode
      courseName
    }
  }
`;

const DELETE_COURSE = gql`
  mutation($courseCode: String!) {
    deleteCourse(courseCode: $courseCode)
  }
`;

export default function CourseManager() {// React component for managing courses

  const { data, loading, refetch } = useQuery(GET_COURSES);  // Fetch course data from the backend
  // Setup mutation hooks for adding and deleting courses
  const [addCourse] = useMutation(ADD_COURSE);  // Add a new course

  const [deleteCourse] = useMutation(DELETE_COURSE);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (code && name) {
      await addCourse({ variables: { courseCode: code, courseName: name } });
      setCode("");// Clear input fields

      setName("");
      refetch();// Refresh the course list
    }
  };

    // Delete a course by its course code
  const handleDelete = async (courseCode: string) => {
    await deleteCourse({ variables: { courseCode } });
    refetch();
  };

  return (
    <div className="course-container">
      <h3>Manage Courses</h3>
      <input
        className="course-input"
        placeholder="Course Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <input
        className="course-input"
        placeholder="Course Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="course-btn" onClick={handleAdd}>
        ➕ Add Course
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="course-list">
          {data?.allCourses.map((c: Course) => (
            <li key={c.courseCode}>
              {c.courseCode}: {c.courseName}
              <button className="course-delete" onClick={() => handleDelete(c.courseCode)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

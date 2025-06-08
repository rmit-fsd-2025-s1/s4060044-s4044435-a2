// Import GraphQL and React hooks
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

// Define the shape of a Lecturer object
interface Lecturer {
  lecturerId: number;
  user: {
    name: string;
  };
}

// Define the shape of a Course
interface Course {
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

const GET_LECTURERS = gql`
  query {
    allLecturers {
      lecturerId
      user {
        name
      }
    }
  }
`;

// GraphQL mutation to assign a lecturer to a course
const ASSIGN_LECTURER = gql`
  mutation($lecturerId: ID!, $courseCode: String!) {
    assignLecturerToCourse(lecturerId: $lecturerId, courseCode: $courseCode) {
      id
    }
  }
`;

// Component for assigning lecturers to courses
export default function LecturerAssignment() {
    // Fetch courses using Apollo useQuery hook

  const { data: courseData, loading: loadingCourses } = useQuery(GET_COURSES);
  const { data: lecturerData, loading: loadingLecturers } = useQuery(GET_LECTURERS);
  const [assignLecturer] = useMutation(ASSIGN_LECTURER);

  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleAssign = async () => {  // Handler function to perform assignment

    if (selectedLecturer && selectedCourse) {
      await assignLecturer({ variables: { lecturerId: selectedLecturer, courseCode: selectedCourse } });      // Execute mutation with selected values

      alert("Lecturer successfully assigned to course.");
      
      setSelectedLecturer("");
      setSelectedCourse("");
    }
  };

  return (
    <div className="lecturer-container">
      <h3>Assign Lecturer to Course</h3>

      <select
        className="lecturer-select"
        value={selectedLecturer}
        onChange={(e) => setSelectedLecturer(e.target.value)}
      >
        <option value="">Select Lecturer</option>
        {loadingLecturers ? (
          <option disabled>Loading...</option>
        ) : (
          lecturerData?.allLecturers.map((l: Lecturer) => (
            <option key={l.lecturerId} value={l.lecturerId}>
              {l.user.name}
            </option>
          ))
        )}
      </select>

      <select
        className="lecturer-select"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        {loadingCourses ? (
          <option disabled>Loading...</option>
        ) : (
          courseData?.allCourses.map((c: Course) => (
            <option key={c.courseCode} value={c.courseCode}>
              {c.courseCode} - {c.courseName}
            </option>
          ))
        )}
      </select>

      <button className="lecturer-btn" onClick={handleAssign}>
        ✅ Assign Lecturer
      </button>
    </div>
  );
}

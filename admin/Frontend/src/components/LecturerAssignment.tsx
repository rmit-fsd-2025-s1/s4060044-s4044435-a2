import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

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

const ASSIGN_LECTURER = gql`
  mutation($lecturerId: ID!, $courseCode: String!) {
    assignLecturerToCourse(lecturerId: $lecturerId, courseCode: $courseCode) {
      id
    }
  }
`;

export default function LecturerAssignment() {
  const { data: courseData } = useQuery(GET_COURSES);
  const { data: lecturerData } = useQuery(GET_LECTURERS);
  const [assignLecturer] = useMutation(ASSIGN_LECTURER);

  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleAssign = async () => {
    if (selectedLecturer && selectedCourse) {
      await assignLecturer({ variables: { lecturerId: selectedLecturer, courseCode: selectedCourse } });
      alert("Lecturer assigned!");
    }
  };

  return (
    <div>
      <h3>Assign Lecturer to Course</h3>

      <select value={selectedLecturer} onChange={(e) => setSelectedLecturer(e.target.value)}>
        <option value="">Select Lecturer</option>
        {lecturerData?.allLecturers.map((l: any) => (
          <option key={l.lecturerId} value={l.lecturerId}>
            {l.user.name}
          </option>
        ))}
      </select>

      <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
        <option value="">Select Course</option>
        {courseData?.allCourses.map((c: any) => (
          <option key={c.courseCode} value={c.courseCode}>
            {c.courseCode} - {c.courseName}
          </option>
        ))}
      </select>

      <button onClick={handleAssign}>Assign</button>
    </div>
  );
}

import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
// import "./course-manager.css";

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

export default function CourseManager() {
  const { data, loading, refetch } = useQuery(GET_COURSES);
  const [addCourse] = useMutation(ADD_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (code && name) {
      await addCourse({ variables: { courseCode: code, courseName: name } });
      setCode("");
      setName("");
      refetch();
    }
  };

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
          {data?.allCourses.map((c: any) => (
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

import { gql } from "graphql-tag";

// GraphQL schema definition
export const typeDefs = gql`
  """
  Represents a system user, such as a candidate or lecturer.
  """
  type User {
    userId: ID!
    name: String!
    email: String!
    role: String!
    joinedAt: String!
    isBlocked: Boolean
  }

  """
  Represents a tutor applicant linked to a user account.
  """
  type Candidate {
    candidateId: ID!
    user: User!
  }

  """
  Represents a lecturer linked to a user account.
  """
  type Lecturer {
    lecturerId: ID!
    user: User!
  }

  """
  Represents a course offered in a semester.
  """
  type Course {
    courseCode: ID!
    courseName: String!
  }

  """
  Represents the assignment of a lecturer to a course.
  """
  type LecturerCourse {
    id: ID!
    lecturer: Lecturer!
    course: Course!
  }

  """
  Represents an application from a candidate for a specific course and role.
  """
  type Application {
    applicationId: ID!
    candidate: Candidate!
    course: Course!
    roleType: String!
    availability: String!
    skills: [String!]!
    academicCredentials: String!
    prevWork: String!
  }

  """
  Represents a comment and ranking submitted by a lecturer on a candidate.
  """
  type Comment {
    commentId: ID!
    lecturer: Lecturer!
    candidate: Candidate!
    course: Course!
    comment: String!
    rank: Int!
    selected: Boolean!
  }

  type Query {
    """
    Fetch all available courses.
    """
    allCourses: [Course!]!

    """
    Fetch all lecturers with their associated user data.
    """
    allLecturers: [Lecturer!]!

    """
    Get the list of candidates applied to each course.
    """
    candidatesPerCourse: [[Candidate!]!]!

    """
    Get candidates selected/applied in more than 3 courses.
    """
    candidatesWithManySelections: [Candidate!]!

    """
    Get candidates who haven't been selected/applied in any course.
    """
    candidatesWithNoSelections: [Candidate!]!
  }

  type Mutation {
    """
    Add a new course with given code and name.
    """
    addCourse(courseCode: String!, courseName: String!): Course!

    """
    Edit an existing course's name using its course code.
    """
    editCourse(courseCode: String!, courseName: String!): Course!

    """
    Delete a course by its course code.
    """
    deleteCourse(courseCode: String!): Boolean!

    """
    Assign a lecturer to a course.
    """
    assignLecturerToCourse(lecturerId: ID!, courseCode: String!): LecturerCourse!

    """
    Block a candidate from accessing the system.
    """
    blockCandidate(candidateId: ID!): Candidate!

    """
    Unblock a candidate and restore access.
    """
    unblockCandidate(candidateId: ID!): Candidate!
  }
`;

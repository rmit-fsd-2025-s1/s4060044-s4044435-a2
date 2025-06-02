import { gql } from "graphql-tag";

// GraphQL schema definition
export const typeDefs = gql`
  type User {
    userId: ID!
    name: String!
    email: String!
    role: String!
    joinedAt: String!
    isBlocked: Boolean
  }

  type Candidate {
    candidateId: ID!
    user: User!
  }

  type Lecturer {
    lecturerId: ID!
    user: User!
  }

  type Course {
    courseCode: ID!
    courseName: String!
  }

  type LecturerCourse {
    id: ID!
    lecturer: Lecturer!
    course: Course!
  }

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
    allCourses: [Course!]!
    candidatesPerCourse: [[Candidate!]!]!
    candidatesWithManySelections: [Candidate!]!
    candidatesWithNoSelections: [Candidate!]!
  }

  type Mutation {
    addCourse(courseCode: String!, courseName: String!): Course!
    editCourse(courseCode: String!, courseName: String!): Course!
    deleteCourse(courseCode: String!): Boolean!
    assignLecturerToCourse(lecturerId: ID!, courseCode: String!): LecturerCourse!
    blockCandidate(candidateId: ID!): Candidate!
    unblockCandidate(candidateId: ID!): Candidate!
  }
`;

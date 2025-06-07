import { gql } from "graphql-tag";
import { createMockServer } from "../utils/test-sercver"; //  Utility to spin up an isolated Apollo Server for tests
import { AppDataSource } from "../data-source";           //  TypeORM data source config
import { ApolloServer } from "@apollo/server";            //  Apollo Server v4 import

/**
 * UNIT TEST: Add Course (Admin Functionality - HD Requirement)
 *
 * GOAL:
 * This test validates the backend resolver that allows an admin to add a course.
 * The mutation simulates a real GraphQL request and verifies that the returned data
 * matches the input. It helps ensure the backend logic for semester course creation is reliable.
 *
 * TECHNICAL DETAILS:
 * - Uses the actual GraphQL schema and resolvers (no mocking logic)
 * - Uses a mock Apollo server to isolate GraphQL behavior
 * - Connects to a test-safe database instance via TypeORM
 */
const ADD_COURSE = gql`
  mutation {
    addCourse(courseCode: "COSC3001", courseName: "Cloud Computing") {
      courseCode
      courseName
    }
  }
`;

describe("Add Course", () => {
  let server: ApolloServer;

  /**
   * BEFORE ALL TESTS:
   * - Extends timeout to allow DB + Apollo startup
   * - Creates a mock Apollo server using actual schema and resolvers
   * - Ensures DB is initialized only once using AppDataSource
   */
  beforeAll(async () => {
    jest.setTimeout(10000);
    server = await createMockServer();
  });

  /**
   * AFTER ALL TESTS:
   * - Cleanly shuts down Apollo server
   * - Destroys TypeORM DB connection to avoid memory leaks
   */
  afterAll(async () => {
    await server.stop();
    await AppDataSource.destroy();
  });

  /**
   *  TEST CASE:
   * 1. Sends `addCourse` mutation to create a new course
   * 2. Receives response from Apollo
   * 3. Verifies the returned courseCode and courseName are exactly as expected
   */
  it("should add a course and return correct fields", async () => {
    const res = await server.executeOperation({ query: ADD_COURSE });

    // Apollo Server v4 wraps the response inside `singleResult`
    const data = (res.body as any).singleResult.data;

    // Validation: Ensure the mutation returns the correct courseCode
    expect(data?.addCourse.courseCode).toBe("COSC3001");

    // Validation: Ensure the mutation returns the correct courseName
    expect(data?.addCourse.courseName).toBe("Cloud Computing");
  });
});

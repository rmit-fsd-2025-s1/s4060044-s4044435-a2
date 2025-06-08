// src/__tests__/selectedCandidatesPerCourse.test.ts

import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { AppDataSource } from "../data-source";
import { createMockServer } from "../utils/test-sercver";

/**
 * UNIT TEST: Selected Candidates Per Course
 *
 * PURPOSE:
 * This test ensures that the system correctly returns a list of candidates
 * who have been selected for each course.
 */

describe("Selected Candidates Per Course Report", () => {
  let server: ApolloServer;

  // Start mock Apollo server before the test
  beforeAll(async () => {
    server = await createMockServer();
  });

  // Stop server and clean up DB connection after test
  afterAll(async () => {
    await server.stop();
    await AppDataSource.destroy();
  });

  // Main test
  it("should return a list of courses with their selected candidates", async () => {
    const QUERY = gql`
      query {
        selectedCandidatesPerCourse {
          course {
            courseCode
            courseName
          }
          candidates {
            candidateId
            user {
              name
              email
            }
          }
        }
      }
    `;

    const res = await server.executeOperation({ query: QUERY });
    const data = (res.body as any).singleResult?.data;

    // Debug log to inspect structure
    console.log("Selected Candidates Per Course:", JSON.stringify(data, null, 2));

    // Assertions
    expect(data?.selectedCandidatesPerCourse).toBeDefined();
    expect(Array.isArray(data.selectedCandidatesPerCourse)).toBe(true);
  });
});

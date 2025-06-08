// src/__tests__/overSelectedCandidates.test.ts

import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { AppDataSource } from "../data-source";
import { createMockServer } from "../utils/test-sercver";

/**
 * UNIT TEST: Over-Selected Candidates Report
 *
 * PURPOSE:
 * This test checks that the admin can retrieve a list of candidates
 * who have been selected in more than 3 courses.
 */

describe("Over-Selected Candidates Report", () => {
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
  it("should return an array of candidates selected in more than 3 courses", async () => {
    const QUERY = gql`
      query {
        overSelectedCandidates {
          candidateId
          user {
            name
            email
          }
        }
      }
    `;

    const res = await server.executeOperation({ query: QUERY });
    const data = (res.body as any).singleResult?.data;

    // Debug output
    console.log("Over-Selected Candidates:", JSON.stringify(data, null, 2));

    // Assertions
    expect(data?.overSelectedCandidates).toBeDefined();
    expect(Array.isArray(data.overSelectedCandidates)).toBe(true);
  });
});

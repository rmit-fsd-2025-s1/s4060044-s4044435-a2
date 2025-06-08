// src/__tests__/unselectedCandidates.test.ts

import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { AppDataSource } from "../data-source";
import { createMockServer } from "../utils/test-sercver";

/**
 * UNIT TEST: Unselected Candidates Report
 *
 * PURPOSE:
 * This test checks that the admin can retrieve a list of candidates
 * who have not been selected for any course.
 */

describe("Unselected Candidates Report", () => {
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
  it("should return an array of candidates not selected for any course", async () => {
    const QUERY = gql`
      query {
        unselectedCandidates {
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

    // Debug log to view structure
    console.log("Unselected Candidates:", JSON.stringify(data, null, 2));

    // Assertions
    expect(data?.unselectedCandidates).toBeDefined();
    expect(Array.isArray(data.unselectedCandidates)).toBe(true);
  });
});

// src/__tests__/blockCandidate.test.ts

import { gql } from "graphql-tag";
import { createMockServer } from "../utils/test-sercver";
import { AppDataSource } from "../data-source";
import { ApolloServer } from "@apollo/server";
import { User } from "../entity/User";
import { Candidate } from "../entity/Candidate";

/**
 * UNIT TEST: Block Candidate
 *
 * PURPOSE:
 * This test verifies that a candidate can be successfully blocked by the admin
 * using the `blockCandidate` mutation. Blocking sets the user's `isBlocked` field to true.
 *
 * SETUP:
 * - Creates a mock user with role 'candidate'
 * - Links the user to a candidate entity
 * - Executes the mutation to block that candidate
 *
 * EXPECTATION:
 * - The response returns the candidate with user.isBlocked set to true
 */

describe("Block Candidate", () => {
  let server: ApolloServer;
  let candidateId: number;

  // GraphQL mutation template
  const getBlockCandidateMutation = (id: number) => gql`
    mutation {
      blockCandidate(candidateId: ${id}) {
        candidateId
        user {
          isBlocked
        }
      }
    }
  `;

  // Setup mock server and seed test data
  beforeAll(async () => {
    jest.setTimeout(10000);
    server = await createMockServer();

    const userRepo = AppDataSource.getRepository(User);
    const candidateRepo = AppDataSource.getRepository(Candidate);

    // Create a user with candidate role
    const user = userRepo.create({
      name: "Jane Doe",
      email: `jane${Date.now()}@test.com`, // prevent unique email clashes
      password: "test123",
      role: "candidate",
      joinedAt: new Date().toISOString(),
      isBlocked: false,
    });
    await userRepo.save(user);

    // Link user to candidate
    const candidate = candidateRepo.create({ user });
    const savedCandidate = await candidateRepo.save(candidate);
    candidateId = savedCandidate.candidateId!;
  });

  // Cleanup after test
  afterAll(async () => {
    await server.stop();
    await AppDataSource.destroy();
  });

  // Main test case
  it("should block the candidate successfully", async () => {
    const BLOCK_CANDIDATE = getBlockCandidateMutation(candidateId);

    // Execute mutation
    const res = await server.executeOperation({ query: BLOCK_CANDIDATE });
    const data = (res.body as any).singleResult?.data;

    // Debug output
    console.log("GraphQL Response:", JSON.stringify(data, null, 2));

    // Assert user is now blocked
    expect(data?.blockCandidate.candidateId).toBe(candidateId.toString());
    expect(data?.blockCandidate.user.isBlocked).toBe(true);
  });
});

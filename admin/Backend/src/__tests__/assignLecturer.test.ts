// src/__tests__/assignLecturer.test.ts

import { gql } from "graphql-tag";
import { createMockServer } from "../utils/test-sercver";
import { AppDataSource } from "../data-source";
import { ApolloServer } from "@apollo/server";
import { User } from "../entity/User";
import { Lecturer } from "../entity/Lecturer";
import { Course } from "../entity/Course";

/**
 * UNIT TEST: Assign Lecturer to Course
 *
 * PURPOSE:
 * This test verifies that a lecturer can be successfully assigned to a course
 * using the `assignLecturerToCourse` GraphQL mutation.
 *
 * SETUP:
 * - Creates a unique lecturer and course in a mock database
 * - Sends mutation to associate them
 */

describe("Assign Lecturer", () => {
  let server: ApolloServer;
  let lecturerId: number; // Will store the lecturer ID after creation

  /**
   * Helper function to construct the GraphQL mutation dynamically,
   * since the lecturerId is generated at runtime.
   */
  const getAssignLecturerMutation = (id: number) => gql`
    mutation {
      assignLecturerToCourse(lecturerId: ${id}, courseCode: "COSC3001") {
        id
        lecturer {
          lecturerId
        }
        course {
          courseCode
        }
      }
    }
  `;

  // Initialize mock Apollo server and seed test data
  beforeAll(async () => {
    jest.setTimeout(10000); // Allow extra time for DB startup
    server = await createMockServer();

    const userRepo = AppDataSource.getRepository(User);
    const lecturerRepo = AppDataSource.getRepository(Lecturer);
    const courseRepo = AppDataSource.getRepository(Course);

    // Create a unique user to prevent email conflicts during repeated test runs
    const user = userRepo.create({
      name: "Dr. Eminem",
      email: `eminem${Date.now()}@rmit.edu.au`,
      password: "test123",
      role: "lecturer",
      joinedAt: new Date().toISOString(),
      isBlocked: false,
    });
    await userRepo.save(user);

    // Create and save a lecturer associated with the user
    const lecturer = lecturerRepo.create({ user });
    const savedLecturer = await lecturerRepo.save(lecturer);
    lecturerId = savedLecturer.lecturerId!; // Capture auto-generated ID

    // Create and save a course to be assigned
    const course = courseRepo.create({
      courseCode: "COSC3001",
      courseName: "Cloud Computing",
    });
    await courseRepo.save(course);
  });

  // Clean up resources after tests complete
  afterAll(async () => {
    await server.stop();
    await AppDataSource.destroy();
  });

  // Core test: Assign a lecturer and verify the result
  it("should assign lecturer to the course", async () => {
    const ASSIGN_LECTURER = getAssignLecturerMutation(lecturerId);

    // Send GraphQL request
    const res = await server.executeOperation({ query: ASSIGN_LECTURER });
    const data = (res.body as any).singleResult?.data;

    // Debug output to help track issues during failures
    console.log("GraphQL Response:", JSON.stringify(data, null, 2));

    // Assertions: compare returned values against the seeded input
    expect(data?.assignLecturerToCourse.lecturer.lecturerId).toBe(lecturerId.toString());
    expect(data?.assignLecturerToCourse.course.courseCode).toBe("COSC3001");
  });
});

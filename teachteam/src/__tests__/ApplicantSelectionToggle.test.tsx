import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LecturerPage from "../pages/lecturers";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

// Mocking next/router to prevent actual navigation
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Set up mock user and applicants
const setupLocalStorageForSelectionTest = () => {
  const mockUser = {
    email: "arnav@rmit.edu.au",
    role: "Lecturer",
  };

  const mockApplicants = [
    {
      fname: "Harshit",
      lname: "Arora",
      phone: "123456789",
      courseCode: "COSC2758",
      availability: "Full Time",
      skills: "React",
      previousWorkExperience: "2 years",
      availableDays: ["Monday", "Wednesday"],
      selected: false,
    },
  ];

  localStorage.setItem("loggedIn", JSON.stringify(mockUser));
  localStorage.setItem("userApplications", JSON.stringify(mockApplicants));
};


describe("Lecturer page test - userApplications display by course code", () => {
  // mock routing
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  // setting up the mock localstorage for testing purposes
  window.alert = jest.fn();
  setupLocalStorageForSelectionTest();
});

// clearing local storage after test
afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// Actual test
test("selects an applicant and updates localStorage", async () => {
  render(<LecturerPage />);

  // Wait for page render
  expect(await screen.findByText(/lecturer page/i)).toBeInTheDocument();

  // Select course COSC2758
  const dropdowns = screen.getAllByRole("combobox");
  const courseDropdown = dropdowns[0];
  fireEvent.change(courseDropdown, { target: { value: "COSC2758" } });

  // Wait for applicant to be displayed
  expect(await screen.findByText(/Harshit Arora/i)).toBeInTheDocument();

  // Click the "Select Applicant" button
  const selectButton = screen.getByRole("button", {
    name: /select applicant/i,
  });
  fireEvent.click(selectButton);

// alert was shaown with correct message
  expect(window.alert).toHaveBeenCalledWith("Harshit Arora has been selected");


  // Check that localStorage was updated with `selected: true`
  await waitFor(() => {
    const updatedApplicants = JSON.parse(
      localStorage.getItem("userApplications") || "[]"
    );
    const updated = updatedApplicants.find(
      (a: any) => a.fname === "Harshit" && a.lname === "Arora"
    );
    expect(updated.selected).toBe(true);
  });
});

import React from "react";
import { render, screen, fireEvent} from "@testing-library/react";
import LecturerPage from "../pages/lecturers";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

// mocking userouter
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

//setting a mockuser in localhost
const setupLocalStorageWithApplications = () => {
  const mockUser = {
    email: "arnav@rmit.edu.au",
    role: "Lecturer",
  };

  //mock applicants
  const mockApplicants = [
    {
      fname: "Harshit",
      lname: "Arora",
      phone: "111222333",
      courseCode: "COSC2758",
      availability: "Full Time",
      skills: "React, Node.js",
      previousWorkExperience: "2 years at XYZ",
      availableDays: ["Monday", "Wednesday"],
      selected: false,
    },
    {
      fname: "Glen",
      lname: "Maxwell",
      phone: "444555666",
      courseCode: "COSC2801",
      availability: "Part Time",
      skills: "Python, Django",
      previousWorkExperience: "1 year at ABC",
      availableDays: ["Tuesday", "Thursday"],
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
  setupLocalStorageWithApplications();
});

afterEach(() => {
  // Cleaning localStorage after each test
  localStorage.clear();
  jest.clearAllMocks();
});

test("displays only applicants from the selected course code in userApplications", async () => {
  // rendering my lecturer page
  render(<LecturerPage></LecturerPage>);

  // making sure that page is loaded before any interaction
  expect(await screen.findByText(/lecturer page/i)).toBeInTheDocument();

  // simulating the course selection taking COSC2758
  const dropdowns = screen.getAllByRole("combobox");
  const courseDropdown = dropdowns[0]; // First select is course dropdown
  fireEvent.change(courseDropdown, { target: { value: "COSC2758" } });

  // this one should be visible
  expect(await screen.getByText(/Harshit Arora/i)).toBeInTheDocument();

  // this one is wrong as the course for this is COSC2801
  expect(screen.queryByText(/Glen Maxwell/i)).not.toBeInTheDocument();
  // if nothing is found queryBytext returns null resulting in no error
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/login";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

// Mock router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("LoginForm", () => {
  // mock router.push
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

  // Adding user to localStorage

  localStorage.setItem(
    "users",
    JSON.stringify([
      {
        email: "aj123@gmail.com",
        password: "Password@1",
      },
    ])
  );

  //mock alertings
  window.alert = jest.fn();
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test("Logging in with correct credentials", () => {
  render(<Login></Login>);

  //Fill email
  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: "aj123@gmail.com" },
  });

  // Fill password
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: "Password@1" },
  });

  // clicking sign in
  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

  // alerting
  expect(window.alert).toHaveBeenCalledWith("Logged In");

  //checking loggedInUser
  const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "[]");
  expect(loggedIn.email).toBe("aj123@gmail.com");

  // routing to Home page after succesfull login
  const mockRouter = useRouter();
  expect(mockRouter.push).toHaveBeenCalledWith("/home");
});

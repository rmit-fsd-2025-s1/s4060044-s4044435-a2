import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import SignupForm from "../pages/signup";

// Mock useRouter
jest.mock("next/router", () => ({ // mock module
  useRouter: jest.fn(), // function
}));

test("Signs up successfully with valid input", () => {
  const push = jest.fn(); // mock push method
  (useRouter as jest.Mock).mockReturnValue({ push });
  window.alert = jest.fn();
  
  // render signup form
  render(<SignupForm />);

  // input email
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "test@example.com" },
  });

  // input password
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "Password@1" },
  });
  // confirm password
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "Password@1" },
  });
  // select role
  fireEvent.change(screen.getByDisplayValue("Select Role"), {
    target: { value: "Tutor" },
  });
  // click signup button
  fireEvent.click(screen.getByText("SIGN UP"));
   
  //check alert
  expect(window.alert).toHaveBeenCalledWith("Signup Successful!");
  expect(push).toHaveBeenCalledWith("/login");
});

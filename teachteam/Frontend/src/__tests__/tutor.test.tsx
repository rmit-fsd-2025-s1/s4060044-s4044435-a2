import React from 'react';
import { render, screen, within } from '@testing-library/react';
import TutorPage from '../pages/tutorPage';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

// Mock router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock user
const mockUser = {
  email: 'ha@example.com',
  role: 'Tutor',
  firstName: 'Harshit',
  lastName: 'Arora',
  phoneNumber: '1234567890',
};

describe('TutorPage Component', () => {
  // Setup before test
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    localStorage.setItem('loggedIn', JSON.stringify(mockUser));
  });

  // Cleanup after test
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // defines a unit test with description
  test('renders course dropdown with correct format', () => {
    // Render component
    render(<TutorPage />); 
    // Getting dropdowns
    const dropdowns = screen.getAllByRole('combobox');
    const courseDropdown = dropdowns[0];
    
    // Check presence
    expect(courseDropdown).toBeInTheDocument();
    
    // Get options of choice available in course
    const options = within(courseDropdown).getAllByRole('option');
    
    // check if it meets the condition
    const hasCoscCourse = options.some((option) =>
      /^COSC\d{4}/.test(option.textContent || '')
    );
    //check weather it matches format
    expect(hasCoscCourse).toBe(true);
  });
});

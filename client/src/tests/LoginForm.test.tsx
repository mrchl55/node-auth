import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../components/LoginForm';
import { AuthProvider } from '../utils/AuthContext';

// Mock the authService to avoid actual API calls
jest.mock('../services/authService', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    verify: jest.fn().mockResolvedValue({ valid: false }),
    getToken: jest.fn().mockReturnValue(null),
  },
}));

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const mockOnSwitchToRegister = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form elements', () => {
    render(
      <MockAuthProvider>
        <LoginForm onSwitchToRegister={mockOnSwitchToRegister} />
      </MockAuthProvider>
    );

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('allows user to type in email and password fields', () => {
    render(
      <MockAuthProvider>
        <LoginForm onSwitchToRegister={mockOnSwitchToRegister} />
      </MockAuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls onSwitchToRegister when sign up button is clicked', () => {
    render(
      <MockAuthProvider>
        <LoginForm onSwitchToRegister={mockOnSwitchToRegister} />
      </MockAuthProvider>
    );

    const signUpButton = screen.getByText(/sign up/i);
    fireEvent.click(signUpButton);

    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });
}); 
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from '../routes/ProtectedRoute';
import { ROLES } from '../utils/constants';

describe('Authentication UI & Route Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders LoginPage with email, password fields and submit button', () => {
    const mockAuth = {
      login: vi.fn(),
      isAuthenticated: false,
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('validates empty inputs on login form submission', async () => {
    const mockAuth = {
      login: vi.fn(),
      isAuthenticated: false,
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Please enter your email address')).toBeInTheDocument();
      expect(screen.getByText('Please enter your password')).toBeInTheDocument();
    });
    expect(mockAuth.login).not.toHaveBeenCalled();
  });

  it('renders RegisterPage with full name, email, password, and role selector', () => {
    const mockAuth = {
      register: vi.fn(),
      isAuthenticated: false,
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText('Learner')).toBeInTheDocument();
    expect(screen.getByText('Instructor')).toBeInTheDocument();
  });

  it('validates required fields on register form', async () => {
    const mockAuth = {
      register: vi.fn(),
      isAuthenticated: false,
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /register & continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Please enter your name')).toBeInTheDocument();
      expect(screen.getByText('Please enter your email address')).toBeInTheDocument();
      expect(screen.getByText('Please enter a password')).toBeInTheDocument();
    });
    expect(mockAuth.register).not.toHaveBeenCalled();
  });

  it('ProtectedRoute displays 403 access restricted when user role is not permitted', () => {
    const mockAuth = {
      user: { id: 1, name: 'Alice', role: ROLES.LEARNER },
      role: ROLES.LEARNER,
      isAuthenticated: true,
      isLoading: false,
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/admin']}>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <div>Admin Secret Panel</div>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.queryByText('Admin Secret Panel')).not.toBeInTheDocument();
  });

  it('ProtectedRoute renders child component when user has required role', () => {
    const mockAuth = {
      user: { id: 1, name: 'Root', role: ROLES.ADMIN },
      role: ROLES.ADMIN,
      isAuthenticated: true,
      isLoading: false,
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/admin']}>
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <div>Admin Secret Panel</div>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Admin Secret Panel')).toBeInTheDocument();
  });
});

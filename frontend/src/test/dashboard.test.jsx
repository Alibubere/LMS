import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LearnerDashboard from '../components/LearnerDashboard';
import InstructorDashboard from '../components/InstructorDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { enrollmentApi, courseApi, progressApi, certificateApi, userApi, categoryApi } from '../api';
import { ROLES } from '../utils/constants';

vi.mock('../api', () => ({
  enrollmentApi: {
    getUserEnrollments: vi.fn(),
  },
  courseApi: {
    getAllCourses: vi.fn(),
    getCourseById: vi.fn(),
  },
  progressApi: {
    getCourseProgress: vi.fn(),
  },
  certificateApi: {
    getCertificate: vi.fn(),
  },
  userApi: {
    getAllUsers: vi.fn(),
  },
  categoryApi: {
    getAllCategories: vi.fn(),
  },
  lessonApi: {
    getLessonsByCourse: vi.fn(),
  },
  quizApi: {
    getQuizzesByCourse: vi.fn(),
  },
}));

describe('Role-Based Dashboards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('LearnerDashboard renders user welcome, KPI statistics, and enrolled courses', async () => {
    const mockLearner = {
      user: { id: 10, name: 'Samantha Lee', role: ROLES.LEARNER },
      role: ROLES.LEARNER,
      isAuthenticated: true,
    };

    enrollmentApi.getUserEnrollments.mockResolvedValueOnce([
      { id: 1, courseId: 100, courseTitle: 'Web Development Bootcamp', progressPercentage: 25 },
    ]);
    courseApi.getCourseById.mockResolvedValueOnce({
      id: 100,
      title: 'Web Development Bootcamp',
      instructorName: 'Prof. Davis',
      totalLessons: 10,
    });
    progressApi.getCourseProgress.mockResolvedValueOnce({
      courseId: 100,
      completedLessons: 2,
      totalLessons: 10,
      overallProgressPercentage: 20,
      courseCompleted: false,
    });

    render(
      <AuthContext.Provider value={mockLearner}>
        <MemoryRouter>
          <LearnerDashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Samantha Lee!/i)).toBeInTheDocument();
      expect(screen.getByText('Enrolled Courses')).toBeInTheDocument();
      expect(screen.getByText('Web Development Bootcamp')).toBeInTheDocument();
    });
  });

  it('InstructorDashboard renders course authoring studio and courses list', async () => {
    const mockInstructor = {
      user: { id: 20, name: 'Prof. Alan Turing', role: ROLES.INSTRUCTOR },
      role: ROLES.INSTRUCTOR,
      isAuthenticated: true,
    };

    courseApi.getAllCourses.mockResolvedValueOnce([
      {
        id: 200,
        title: 'Algorithms & Data Structures',
        instructorId: 20,
        status: 'PUBLISHED',
        totalLessons: 15,
        totalEnrolled: 80,
      },
    ]);
    categoryApi.getAllCategories.mockResolvedValueOnce([
      { id: 1, name: 'Computer Science' },
    ]);

    render(
      <AuthContext.Provider value={mockInstructor}>
        <MemoryRouter>
          <InstructorDashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Course Management & Curriculum/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create course/i })).toBeInTheDocument();
      expect(screen.getByText('Algorithms & Data Structures')).toBeInTheDocument();
    });
  });

  it('AdminDashboard renders platform command center and user directory', async () => {
    const mockAdmin = {
      user: { id: 99, name: 'Administrator', role: ROLES.ADMIN },
      role: ROLES.ADMIN,
      isAuthenticated: true,
    };

    userApi.getAllUsers.mockResolvedValueOnce([
      { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: ROLES.LEARNER, createdAt: '2026-01-01' },
      { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: ROLES.INSTRUCTOR, createdAt: '2026-01-02' },
    ]);
    courseApi.getAllCourses.mockResolvedValueOnce([]);
    categoryApi.getAllCategories.mockResolvedValueOnce([
      { id: 1, name: 'Engineering', description: 'Tech courses', courseCount: 5 },
    ]);

    render(
      <AuthContext.Provider value={mockAdmin}>
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Platform Command Center/i)).toBeInTheDocument();
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });
  });
});

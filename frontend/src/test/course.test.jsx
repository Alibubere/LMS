import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import CourseList from '../components/CourseList';
import EnrollmentButton from '../components/EnrollmentButton';
import { enrollmentApi } from '../api';
import { ROLES } from '../utils/constants';

vi.mock('../api', () => ({
  enrollmentApi: {
    enroll: vi.fn(),
    unenroll: vi.fn(),
  },
  courseApi: {
    getCourseById: vi.fn(),
    getAllCourses: vi.fn(),
  },
  lessonApi: {
    getLessonsByCourse: vi.fn(),
  },
  progressApi: {
    getCourseProgress: vi.fn(),
  },
  quizApi: {
    getQuizzesByCourse: vi.fn(),
  },
}));

describe('Course & Enrollment Components', () => {
  const sampleCourse = {
    id: 10,
    title: 'Modern Java & Spring Boot',
    description: 'Learn modern microservices with Spring Boot and JPA.',
    categoryName: 'Backend Development',
    instructorName: 'Dr. Jane Smith',
    status: 'PUBLISHED',
    totalLessons: 12,
    totalEnrolled: 45,
  };

  const mockAuth = {
    user: { id: 1, name: 'Learner User', role: ROLES.LEARNER },
    role: ROLES.LEARNER,
    isAuthenticated: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CourseCard with title, category, instructor, and lessons', () => {
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <CourseCard course={sampleCourse} isEnrolled={false} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Modern Java & Spring Boot')).toBeInTheDocument();
    expect(screen.getByText('Backend Development')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('12 lessons')).toBeInTheDocument();
    expect(screen.getByText('45 learners')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enroll now/i })).toBeInTheDocument();
  });

  it('renders CourseCard with Continue Learning when user is enrolled', () => {
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <CourseCard
            course={sampleCourse}
            isEnrolled={true}
            progress={{ overallProgressPercentage: 50, completedLessons: 6, totalLessons: 12 }}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole('button', { name: /continue learning/i })).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('6 / 12 lessons')).toBeInTheDocument();
  });

  it('CourseList displays list of courses or empty state', () => {
    const { rerender } = render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <CourseList courses={[sampleCourse]} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Modern Java & Spring Boot')).toBeInTheDocument();

    rerender(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <CourseList courses={[]} emptyMessage="No matching courses" />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('No matching courses')).toBeInTheDocument();
  });

  it('EnrollmentButton calls enrollmentApi.enroll on click', async () => {
    enrollmentApi.enroll.mockResolvedValueOnce({ id: 100, courseId: 10 });
    const handleChanged = vi.fn();

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <EnrollmentButton
            courseId={10}
            isEnrolled={false}
            onEnrollmentChanged={handleChanged}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const enrollBtn = screen.getByRole('button', { name: /enroll now/i });
    fireEvent.click(enrollBtn);

    await waitFor(() => {
      expect(enrollmentApi.enroll).toHaveBeenCalledWith(10, 1);
      expect(handleChanged).toHaveBeenCalledWith(true);
    });
  });
});

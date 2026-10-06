import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import DiscussionItem from '../components/DiscussionItem';
import DiscussionList from '../components/DiscussionList';
import FeedbackForm from '../components/FeedbackForm';
import CertificateCard from '../components/CertificateCard';
import { discussionApi, feedbackApi } from '../api';
import { ROLES } from '../utils/constants';

vi.mock('../api', () => ({
  discussionApi: {
    getCourseDiscussions: vi.fn(),
    createDiscussion: vi.fn(),
    replyToDiscussion: vi.fn(),
    deleteDiscussion: vi.fn(),
  },
  feedbackApi: {
    getCourseFeedback: vi.fn(),
    submitFeedback: vi.fn(),
    updateFeedback: vi.fn(),
  },
}));

describe('Discussions, Feedback & Certificates', () => {
  const mockAuth = {
    user: { id: 1, name: 'Student Bob', role: ROLES.LEARNER },
    role: ROLES.LEARNER,
    isAuthenticated: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('DiscussionItem displays discussion title, content, and author tag', () => {
    const sampleItem = {
      id: 1,
      title: 'Question regarding JPA relationships',
      content: 'Can someone clarify when to use ManyToMany with JoinTable?',
      userName: 'Alice',
      userRole: 'LEARNER',
      createdAt: '2026-10-01T10:00:00Z',
      replies: [],
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <DiscussionItem discussion={sampleItem} />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Question regarding JPA relationships')).toBeInTheDocument();
    expect(screen.getByText(/Can someone clarify when to use ManyToMany/i)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('LEARNER')).toBeInTheDocument();
  });

  it('DiscussionList loads and displays discussions for a course', async () => {
    discussionApi.getCourseDiscussions.mockResolvedValueOnce([
      {
        id: 1,
        title: 'Course introduction query',
        content: 'Is Java 17 or 21 used?',
        userName: 'David',
        userRole: 'LEARNER',
        createdAt: '2026-10-02T10:00:00Z',
        replies: [],
      },
    ]);

    render(
      <AuthContext.Provider value={mockAuth}>
        <DiscussionList courseId={10} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Course Discussions (1)')).toBeInTheDocument();
      expect(screen.getByText('Course introduction query')).toBeInTheDocument();
    });
  });

  it('FeedbackForm calculates and displays average rating and reviews', async () => {
    feedbackApi.getCourseFeedback.mockResolvedValueOnce([
      {
        id: 1,
        userId: 2,
        userName: 'Charlie',
        rating: 5,
        comment: 'Outstanding clarity on the backend architecture!',
        createdAt: '2026-10-03T10:00:00Z',
      },
    ]);

    render(
      <AuthContext.Provider value={mockAuth}>
        <FeedbackForm courseId={10} isEnrolled={true} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('5.0')).toBeInTheDocument();
      expect(screen.getByText('Outstanding clarity on the backend architecture!')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });
  });

  it('CertificateCard displays credential code, student name, and course title', () => {
    const sampleCert = {
      certificateCode: 'CERT-2026-987654',
      userName: 'John Doe',
      courseTitle: 'Enterprise Spring Boot & Microservices',
      issueDate: '2026-10-05T12:00:00Z',
      grade: 'Distinction',
    };

    render(<CertificateCard certificate={sampleCert} />);

    expect(screen.getByText('Official Certificate of Completion')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Spring Boot & Microservices')).toBeInTheDocument();
    expect(screen.getByText('CERT-2026-987654')).toBeInTheDocument();
    expect(screen.getByText('Distinction')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /print or save pdf/i })).toBeInTheDocument();
  });
});

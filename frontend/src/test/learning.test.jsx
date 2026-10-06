import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProgressBar from '../components/ProgressBar';
import LessonPlayer from '../components/LessonPlayer';
import { progressApi } from '../api';

vi.mock('../api', () => ({
  progressApi: {
    recordLessonProgress: vi.fn(),
  },
}));

describe('Learning & Progress Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ProgressBar renders completion percentage and lesson counter', () => {
    render(
      <ProgressBar
        percentage={75}
        completedLessons={9}
        totalLessons={12}
        showDetails={true}
      />
    );

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('9 / 12 lessons')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('ProgressBar displays Completed tag when 100% finished', () => {
    render(
      <ProgressBar
        percentage={100}
        completedLessons={12}
        totalLessons={12}
        showDetails={true}
      />
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('LessonPlayer renders lesson details and handles Mark Complete click', async () => {
    progressApi.recordLessonProgress.mockResolvedValueOnce({ id: 1, completed: true });
    const handleProgressUpdated = vi.fn();
    const handleNext = vi.fn();
    const handlePrev = vi.fn();

    const sampleLesson = {
      id: 201,
      title: 'REST Architecture Principles',
      description: 'Understanding statelessness and uniform interface.',
      contentText: 'REST stands for Representational State Transfer...',
      durationMinutes: 20,
      completed: false,
    };

    render(
      <LessonPlayer
        lesson={sampleLesson}
        courseId={10}
        onProgressUpdated={handleProgressUpdated}
        onNextLesson={handleNext}
        onPrevLesson={handlePrev}
        hasNext={true}
        hasPrev={true}
      />
    );

    expect(screen.getByText('REST Architecture Principles')).toBeInTheDocument();
    expect(screen.getByText(/Representational State Transfer/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated duration: 20 min/i)).toBeInTheDocument();

    const markBtn = screen.getByRole('button', { name: /mark lesson complete/i });
    fireEvent.click(markBtn);

    await waitFor(() => {
      expect(progressApi.recordLessonProgress).toHaveBeenCalledWith(201, {
        completed: true,
        completionPercentage: 100.0,
        watchTimeSeconds: 1200,
      });
      expect(handleProgressUpdated).toHaveBeenCalledWith(201, true);
    });

    // Test navigation buttons
    const nextBtn = screen.getByRole('button', { name: /next lesson/i });
    fireEvent.click(nextBtn);
    expect(handleNext).toHaveBeenCalledTimes(1);

    const prevBtn = screen.getByRole('button', { name: /previous lesson/i });
    fireEvent.click(prevBtn);
    expect(handlePrev).toHaveBeenCalledTimes(1);
  });
});

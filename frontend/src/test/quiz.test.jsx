import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import QuizResult from '../components/QuizResult';
import QuizPage from '../components/QuizPage';
import { quizApi } from '../api';

vi.mock('../api', () => ({
  quizApi: {
    getQuizById: vi.fn(),
    submitQuiz: vi.fn(),
  },
}));

describe('Assessments & Quizzes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleQuiz = {
    id: 5,
    title: 'Spring Framework Fundamentals',
    description: 'Test your understanding of dependency injection and annotations.',
    passingScore: 70,
    timeLimitMinutes: 15,
    totalQuestions: 2,
    totalPoints: 2,
    courseId: 10,
    questions: [
      {
        id: 101,
        questionText: 'Which annotation is used to declare a Spring bean component?',
        optionA: '@Component',
        optionB: '@Injectable',
        optionC: '@Entity',
        optionD: '@Resource',
        points: 1,
      },
      {
        id: 102,
        questionText: 'What does IoC stand for in Spring?',
        optionA: 'Integration of Code',
        optionB: 'Inversion of Control',
        optionC: 'Instance on Call',
        optionD: 'Internal of Core',
        points: 1,
      },
    ],
  };

  it('QuizCard renders title, questions, pass score, and start button', () => {
    render(
      <MemoryRouter>
        <QuizCard quiz={sampleQuiz} />
      </MemoryRouter>
    );

    expect(screen.getByText('Spring Framework Fundamentals')).toBeInTheDocument();
    expect(screen.getByText(/2 questions/i)).toBeInTheDocument();
    expect(screen.getByText(/Pass: 70%/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument();
  });

  it('QuizResult renders authoritative score, percentage, pass status, and question review', () => {
    const sampleResult = {
      score: 2,
      totalPoints: 2,
      percentage: 100,
      passed: true,
      answers: [
        {
          id: 1,
          questionId: 101,
          questionText: 'Which annotation is used to declare a Spring bean component?',
          selectedOption: 'A',
          correctOption: 'A',
          isCorrect: true,
          pointsAwarded: 1,
          explanation: '@Component marks a class as a Spring-managed component.',
        },
      ],
    };

    render(
      <MemoryRouter>
        <QuizResult result={sampleResult} quiz={sampleQuiz} courseId={10} />
      </MemoryRouter>
    );

    expect(screen.getByText('Assessment Passed!')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText(/Detailed Question Review/i)).toBeInTheDocument();
    expect(screen.getByText(/@Component marks a class as a Spring-managed component/i)).toBeInTheDocument();
  });

  it('QuizPage renders questions, supports option selection, and submits quiz', async () => {
    quizApi.getQuizById.mockResolvedValueOnce(sampleQuiz);
    quizApi.submitQuiz.mockResolvedValueOnce({
      score: 2,
      totalPoints: 2,
      percentage: 100,
      passed: true,
      answers: [],
    });

    render(
      <MemoryRouter initialEntries={['/quizzes/5']}>
        <Routes>
          <Route path="/quizzes/:id" element={<QuizPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Spring Framework Fundamentals')).toBeInTheDocument();
      expect(screen.getByText('Which annotation is used to declare a Spring bean component?')).toBeInTheDocument();
    });

    // Select option A
    const optionA = screen.getByText('@Component');
    fireEvent.click(optionA);

    // Click Next
    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);

    // On Question 2, select option B
    await waitFor(() => {
      expect(screen.getByText('What does IoC stand for in Spring?')).toBeInTheDocument();
    });

    const optionB = screen.getByText('Inversion of Control');
    fireEvent.click(optionB);

    // Submit Quiz
    const submitBtn = screen.getByRole('button', { name: /submit quiz/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(quizApi.submitQuiz).toHaveBeenCalledWith('5', [
        { questionId: 101, selectedOption: 'A' },
        { questionId: 102, selectedOption: 'B' },
      ]);
    });
  });
});

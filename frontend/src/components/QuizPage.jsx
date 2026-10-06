import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, message } from 'antd';
import {
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  SendOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import QuizResult from './QuizResult';
import LoadingState from './common/LoadingState';
import ErrorState from './common/ErrorState';
import { Badge } from './ui';
import { quizApi } from '../api';

export const QuizPage = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  const fetchQuiz = useCallback(async () => {
    if (!quizId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await quizApi.getQuizById(quizId);
      setQuiz(data);
      if (data.timeLimitMinutes) {
        setRemainingSeconds(data.timeLimitMinutes * 60);
      }
    } catch (err) {
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const doSubmit = async () => {
    try {
      setSubmitting(true);
      const payloadAnswers = Object.entries(selectedAnswers).map(([qId, opt]) => ({
        questionId: Number(qId),
        selectedOption: opt,
      }));

      const result = await quizApi.submitQuiz(quizId, payloadAnswers);
      setAttemptResult(result);
      message.success('Quiz submitted successfully!');
    } catch (err) {
      message.error(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0 || attemptResult) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          doSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, attemptResult]);

  const handleSelectOption = (questionId, optionKey) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmitQuiz = async (autoSubmit = false) => {
    if (!autoSubmit && answeredCount < totalQuestions) {
      Modal.confirm({
        title: 'Unanswered Questions',
        icon: <ExclamationCircleOutlined />,
        content: `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to submit?`,
        okText: 'Yes, Submit',
        cancelText: 'Continue Quiz',
        onOk: doSubmit,
      });
      return;
    }
    await doSubmit();
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setAttemptResult(null);
    if (quiz?.timeLimitMinutes) {
      setRemainingSeconds(quiz.timeLimitMinutes * 60);
    }
  };

  if (loading) {
    return <LoadingState tip="Preparing your assessment..." fullPage />;
  }

  if (error || !quiz) {
    return (
      <ErrorState
        title="Could not load quiz"
        subTitle={error || 'Assessment not found'}
        onRetry={fetchQuiz}
      />
    );
  }

  if (attemptResult) {
    return (
      <QuizResult
        result={attemptResult}
        quiz={quiz}
        courseId={quiz.courseId}
        onRetake={handleRetake}
      />
    );
  }

  if (totalQuestions === 0) {
    return (
      <div className="card mx-auto max-w-xl">
        <div className="card-pad-lg text-center">
          <p className="eyebrow">Assessment</p>
          <h3 className="mt-4 text-display-md text-ink">No questions available</h3>
          <p className="mt-3 text-body-md text-body">
            This quiz does not currently have any questions assigned.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const percentAnswered = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top bar */}
      <div className="card">
        <div className="card-pad flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Assessment</p>
            <h1 className="mt-3 text-display-lg text-ink">{quiz.title}</h1>
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            {remainingSeconds !== null && (
              <div
                className={`flex items-center gap-2 rounded-sm border px-3 py-2 font-mono text-sm font-medium ${
                  remainingSeconds < 300
                    ? 'border-danger text-danger animate-pulse'
                    : 'border-hairline text-ink'
                }`}
                role="timer"
              >
                <ClockCircleOutlined />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
            )}

            <p className="text-caption text-body">
              Answered:{' '}
              <span className="text-caption-strong text-ink">
                {answeredCount}/{totalQuestions}
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-hairline px-6 py-4">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percentAnswered}%` }} />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <div className="card-pad">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <span className="eyebrow">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <Badge variant="neutral">
              {currentQuestion.points || 1} pt{(currentQuestion.points || 1) > 1 ? 's' : ''}
            </Badge>
          </div>

          <h2 className="mt-6 text-body-lg-strong text-ink">
            {currentQuestion.questionText}
          </h2>

          {/* Options */}
          <div className="mt-6 space-y-3">
            {[
              { key: 'A', text: currentQuestion.optionA },
              { key: 'B', text: currentQuestion.optionB },
              { key: 'C', text: currentQuestion.optionC },
              { key: 'D', text: currentQuestion.optionD },
            ]
              .filter((opt) => Boolean(opt.text))
              .map((opt) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                    className={`flex w-full items-start gap-3 rounded-sm border p-4 text-left transition-colors ${
                      isSelected
                        ? 'border-ink bg-canvas'
                        : 'border-hairline bg-canvas hover:border-ink'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-medium ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-hairline text-body'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="pt-1 text-body-md text-ink">{opt.text}</span>
                  </button>
                );
              })}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-hairline pt-5">
            <Button
              icon={<LeftOutlined />}
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button
                  type="primary"
                  icon={<RightOutlined />}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  loading={submitting}
                  onClick={() => handleSubmitQuiz(false)}
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question palette */}
      <div className="card">
        <div className="card-pad">
          <p className="eyebrow">Jump to question</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(selectedAnswers[q.id]);
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id || idx}
                  type="button"
                  aria-label={`Question ${idx + 1}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex h-11 w-11 items-center justify-center rounded-sm font-mono text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'bg-primary text-on-primary'
                      : isAnswered
                        ? 'bg-hairline text-ink hover:border hover:border-ink'
                        : 'border border-hairline bg-canvas text-body hover:border-ink hover:text-ink'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

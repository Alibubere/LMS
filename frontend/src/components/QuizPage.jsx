import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Progress, Tag, Modal, message } from 'antd';
import {
  ClockCircleOutlined,
  CheckOutlined,
  LeftOutlined,
  RightOutlined,
  SendOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import QuizResult from './QuizResult';
import LoadingState from './common/LoadingState';
import ErrorState from './common/ErrorState';
import { quizApi } from '../api';

export const QuizPage = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
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

  // Timer countdown
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0 || attemptResult) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(true); // Auto-submit on time expiry
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, attemptResult]);

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

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
      <Card className="max-w-xl mx-auto rounded-xl text-center p-8">
        <h3 className="text-lg font-bold text-gray-800">No questions available</h3>
        <p className="text-sm text-gray-500 mt-2">
          This quiz does not currently have any questions assigned.
        </p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </Card>
    );
  }

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Top bar: Title, timer, progress */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-blue-600 font-bold">
            Assessment
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">{quiz.title}</h1>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          {remainingSeconds !== null && (
            <div
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                remainingSeconds < 300
                  ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <ClockCircleOutlined />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>
          )}

          <div className="text-xs font-semibold text-gray-500">
            Answered: <strong className="text-gray-900">{answeredCount}/{totalQuestions}</strong>
          </div>
        </div>
      </div>

      <Progress
        percent={Math.round((answeredCount / totalQuestions) * 100)}
        showInfo={false}
        strokeColor="#3b82f6"
      />

      {/* Main Question Card */}
      <Card className="rounded-2xl border-gray-200 shadow-sm p-2 sm:p-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <span className="text-xs font-semibold text-gray-400">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <Tag color="blue">{currentQuestion.points || 1} pt{(currentQuestion.points || 1) > 1 ? 's' : ''}</Tag>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.questionText}
        </h3>

        {/* Options */}
        <div className="space-y-3">
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
                  onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/50 bg-white'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-sm text-gray-800 leading-relaxed font-medium pt-0.5">
                    {opt.text}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Navigation buttons */}
        <div className="border-t border-gray-100 mt-8 pt-4 flex items-center justify-between">
          <Button
            icon={<LeftOutlined />}
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          >
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button
                type="primary"
                icon={<RightOutlined />}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={submitting}
                onClick={() => handleSubmitQuiz(false)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Question palette / navigator */}
      <Card className="rounded-xl border-gray-200">
        <div className="text-xs font-semibold text-gray-400 mb-3">Jump to Question:</div>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(selectedAnswers[q.id]);
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id || idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                  isCurrent
                    ? 'ring-2 ring-blue-600 ring-offset-1 bg-blue-600 text-white'
                    : isAnswered
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default QuizPage;

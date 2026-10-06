import React from 'react';
import { Card, Tag, Button } from 'antd';
import {
  ClockCircleOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const QuizCard = ({ quiz, onTakeQuiz }) => {
  const {
    id,
    title,
    description,
    passingScore = 70,
    timeLimitMinutes,
    totalQuestions = 0,
    totalPoints = 0,
    courseTitle,
  } = quiz;

  return (
    <Card className="rounded-xl border border-gray-200 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {courseTitle && (
            <div className="text-xs font-semibold text-blue-600 mb-1">
              {courseTitle}
            </div>
          )}
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {description || 'Assess your understanding of the concepts covered.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-3">
            <span className="flex items-center space-x-1">
              <QuestionCircleOutlined />
              <span>{totalQuestions} questions ({totalPoints} pts)</span>
            </span>
            {timeLimitMinutes && (
              <span className="flex items-center space-x-1">
                <ClockCircleOutlined />
                <span>{timeLimitMinutes} minutes</span>
              </span>
            )}
            <Tag color="cyan">Pass: {passingScore}%</Tag>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link to={`/quizzes/${id}`}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={onTakeQuiz}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Quiz
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default QuizCard;

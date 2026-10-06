import React from 'react';
import { Button } from 'antd';
import { ClockCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Badge } from './ui';

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
    <article className="card card-interactive">
      <div className="card-pad flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {courseTitle && <p className="eyebrow mb-3">{courseTitle}</p>}
          <h3 className="text-display-md text-ink">{title}</h3>
          <p className="mt-2 text-body-md text-body">
            {description || 'Assess your understanding of the concepts covered.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-body">
            <span className="flex items-center gap-1.5">
              <span>{totalQuestions} questions ({totalPoints} pts)</span>
            </span>
            {timeLimitMinutes && (
              <span className="flex items-center gap-1.5">
                <ClockCircleOutlined />
                <span>{timeLimitMinutes} minutes</span>
              </span>
            )}
            <Badge variant="mint">Pass: {passingScore}%</Badge>
          </div>
        </div>

        <div className="shrink-0">
          <Link to={`/quizzes/${id}`}>
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={onTakeQuiz}>
              Start Quiz
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default QuizCard;

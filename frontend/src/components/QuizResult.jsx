import React from 'react';
import { Button } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ReloadOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui';
import { formatPercentage } from '../utils/formatters';

export const QuizResult = ({ result, quiz, onRetake, courseId }) => {
  const navigate = useNavigate();

  if (!result) return null;

  const { score = 0, totalPoints = 0, percentage = 0, passed = false, answers = [] } = result;
  const passingScore = quiz?.passingScore || 70;

  const stats = [
    { label: 'Your score', value: `${score} / ${totalPoints}` },
    { label: 'Percentage', value: formatPercentage(percentage) },
    { label: 'Passing score', value: `${passingScore}%` },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Verdict */}
      <div className="card">
        <div className="card-pad-lg text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-sm ${
              passed ? 'bg-accent-mint text-ink' : 'bg-hairline text-ink'
            }`}
          >
            {passed ? <TrophyOutlined className="text-2xl" /> : <CloseCircleFilled className="text-2xl" />}
          </div>

          <div className="mt-5 flex justify-center">
            <Badge variant={passed ? 'success' : 'danger'}>
              {passed ? 'Passed' : 'Not passed'}
            </Badge>
          </div>

          <h2 className="mt-4 text-display-lg text-ink">
            {passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-body-md text-body">
            {passed
              ? 'Great job! You met the passing threshold for this assessment.'
              : `You scored ${formatPercentage(percentage)}, which is below the passing mark of ${passingScore}%. Review the explanations below and try again.`}
          </p>

          {/* Stats */}
          <dl className="mt-8 grid grid-cols-1 divide-y divide-hairline border-y border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-5">
                <dt className="eyebrow">{stat.label}</dt>
                <dd className="mt-3 text-display-lg text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {onRetake && (
              <Button icon={<ReloadOutlined />} onClick={onRetake} size="large">
                Retake Assessment
              </Button>
            )}
            {courseId && (
              <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                Back to Course
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Question review */}
      {answers && answers.length > 0 && (
        <div className="card">
          <div className="border-b border-hairline px-6 py-5">
            <h3 className="text-display-md text-ink">Detailed Question Review</h3>
          </div>

          <div className="card-pad space-y-4">
            {answers.map((ans, idx) => (
              <div
                key={ans.id || idx}
                className={`rounded-sm border p-5 ${
                  ans.isCorrect ? 'border-hairline' : 'border-danger'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="eyebrow shrink-0 pt-1">Q{idx + 1}.</span>
                    <span className="text-body-md-strong text-ink">{ans.questionText}</span>
                  </div>
                  <Badge variant={ans.isCorrect ? 'success' : 'danger'}>
                    {ans.isCorrect ? `+${ans.pointsAwarded} pts` : '0 pts'}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-sm border border-hairline bg-canvas p-3">
                    <span className="eyebrow block">Your answer</span>
                    <span
                      className={`mt-2 block text-body-md-strong ${
                        ans.isCorrect ? 'text-ink' : 'text-danger'
                      }`}
                    >
                      Option {ans.selectedOption}
                    </span>
                  </div>

                  <div className="rounded-sm border border-hairline bg-canvas p-3">
                    <span className="eyebrow block">Correct answer</span>
                    <span className="mt-2 block text-body-md-strong text-ink">
                      Option {ans.correctOption}
                    </span>
                  </div>
                </div>

                {ans.explanation && (
                  <div className="mt-3 rounded-sm bg-hairline p-3">
                    <span className="eyebrow block">Explanation</span>
                    <p className="mt-2 text-caption leading-relaxed text-ink">{ans.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResult;

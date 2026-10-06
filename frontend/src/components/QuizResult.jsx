import React from 'react';
import { Result, Button, Tag, Card, Divider } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ReloadOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatPercentage } from '../utils/formatters';

export const QuizResult = ({
  result,
  quiz,
  onRetake,
  courseId,
}) => {
  const navigate = useNavigate();

  if (!result) return null;

  const {
    score = 0,
    totalPoints = 0,
    percentage = 0,
    passed = false,
    answers = [],
  } = result;

  const passingScore = quiz?.passingScore || 70;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="rounded-2xl border-gray-200 shadow-sm text-center p-6">
        <Result
          status={passed ? 'success' : 'warning'}
          icon={
            passed ? (
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                <TrophyOutlined />
              </div>
            ) : (
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                <CloseCircleFilled />
              </div>
            )
          }
          title={
            <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
              {passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
            </h2>
          }
          subTitle={
            <p className="text-gray-600 text-sm max-w-md mx-auto mt-1">
              {passed
                ? 'Great job! You met the passing threshold for this assessment.'
                : `You scored ${formatPercentage(percentage)}, which is below the passing mark of ${passingScore}%. Review the explanations below and try again.`}
            </p>
          }
          extra={[
            <div key="stats" className="flex items-center justify-center space-x-6 py-4">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Your Score</div>
                <div className="text-2xl font-bold text-gray-800">{score} / {totalPoints}</div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Percentage</div>
                <div className={`text-2xl font-bold ${passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {formatPercentage(percentage)}
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Passing Score</div>
                <div className="text-2xl font-bold text-gray-800">{passingScore}%</div>
              </div>
            </div>,
            <div key="actions" className="flex items-center justify-center space-x-3 mt-4">
              {onRetake && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onRetake}
                  size="large"
                >
                  Retake Assessment
                </Button>
              )}
              {courseId && (
                <Button
                  type="primary"
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Back to Course
                </Button>
              )}
            </div>,
          ]}
        />
      </Card>

      {/* Authoritative Answers Breakdown */}
      {answers && answers.length > 0 && (
        <Card className="rounded-2xl border-gray-200 shadow-sm p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Detailed Question Review</h3>
          <div className="space-y-4">
            {answers.map((ans, idx) => (
              <div
                key={ans.id || idx}
                className={`p-4 rounded-xl border ${
                  ans.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-red-200 bg-red-50/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-gray-800">
                      Q{idx + 1}.
                    </span>
                    <span className="font-medium text-sm text-gray-900">
                      {ans.questionText}
                    </span>
                  </div>
                  <Tag
                    color={ans.isCorrect ? 'success' : 'error'}
                    icon={ans.isCorrect ? <CheckCircleFilled /> : <CloseCircleFilled />}
                  >
                    {ans.isCorrect ? `+${ans.pointsAwarded} pts` : '0 pts'}
                  </Tag>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-400 block font-semibold">Your Answer:</span>
                    <span className={`font-bold ${ans.isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                      Option {ans.selectedOption}
                    </span>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-gray-200">
                    <span className="text-gray-400 block font-semibold">Correct Answer:</span>
                    <span className="font-bold text-emerald-700">
                      Option {ans.correctOption}
                    </span>
                  </div>
                </div>

                {ans.explanation && (
                  <div className="mt-2 text-xs text-gray-600 bg-white/80 p-2.5 rounded-lg border border-gray-200">
                    <span className="font-semibold text-gray-700">Explanation: </span>
                    {ans.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuizResult;

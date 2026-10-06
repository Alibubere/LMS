import React from 'react';
import { Progress, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { formatPercentage } from '../utils/formatters';

export const ProgressBar = ({
  percentage = 0,
  completedLessons = 0,
  totalLessons = 0,
  showDetails = true,
  size = 'default',
}) => {
  const safePercent = Math.min(100, Math.max(0, Math.round(percentage || 0)));
  const isComplete = safePercent >= 100;

  return (
    <div className="w-full space-y-1.5">
      {showDetails && (
        <div className="flex items-center justify-between text-xs font-medium text-gray-600">
          <div className="flex items-center space-x-1.5">
            {isComplete ? (
              <Tag color="success" icon={<CheckCircleOutlined />} className="m-0">
                Completed
              </Tag>
            ) : (
              <Tag color="processing" icon={<ClockCircleOutlined />} className="m-0">
                In Progress
              </Tag>
            )}
            {totalLessons > 0 && (
              <span className="text-gray-500">
                {completedLessons} / {totalLessons} lessons
              </span>
            )}
          </div>
          <span className="font-bold text-gray-800">{formatPercentage(safePercent)}</span>
        </div>
      )}

      <Progress
        percent={safePercent}
        size={size === 'small' ? 'small' : 'default'}
        showInfo={false}
        strokeColor={
          isComplete
            ? '#10b981'
            : {
                '0%': '#3b82f6',
                '100%': '#6366f1',
              }
        }
      />
    </div>
  );
};

export default ProgressBar;

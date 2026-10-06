import React from 'react';
import { Badge } from './ui';
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
    <div className="w-full space-y-2">
      {showDetails && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isComplete ? 'success' : 'neutral'}>
              {isComplete ? 'Completed' : 'In Progress'}
            </Badge>
            {totalLessons > 0 && (
              <span className="text-caption text-body">
                {completedLessons} / {totalLessons} lessons
              </span>
            )}
          </div>
          <span className="text-caption-strong text-ink">{formatPercentage(safePercent)}</span>
        </div>
      )}

      <div
        className={`progress-track ${size === 'small' ? 'h-1' : ''}`}
        role="progressbar"
        aria-valuenow={safePercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Course progress"
      >
        <div className="progress-fill" style={{ width: `${safePercent}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;

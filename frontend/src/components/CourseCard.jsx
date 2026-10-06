import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from 'antd';
import { UserOutlined, TeamOutlined, ReadOutlined } from '@ant-design/icons';
import EnrollmentButton from './EnrollmentButton';
import ProgressBar from './ProgressBar';
import { Badge } from './ui';
import { COURSE_STATUS } from '../utils/constants';

export const CourseCard = ({
  course,
  isEnrolled = false,
  progress = null,
  showStatus = false,
  onEnrollmentChanged,
}) => {
  const {
    id,
    title,
    description,
    categoryName,
    instructorName,
    status,
    thumbnailUrl,
    totalLessons = 0,
    totalEnrolled = 0,
  } = course;

  const defaultThumbnail =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';

  return (
    <article className="card card-interactive flex h-full flex-col overflow-hidden">
      {/* Cover */}
      <Link
        to={`/courses/${id}`}
        className="relative block h-44 overflow-hidden border-b border-hairline bg-hairline"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          alt=""
          src={thumbnailUrl || defaultThumbnail}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = defaultThumbnail;
          }}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {categoryName && <Badge variant="neutral">{categoryName}</Badge>}
          {showStatus && status && (
            <Badge variant={status === COURSE_STATUS.PUBLISHED ? 'mint' : 'outline'}>
              {status}
            </Badge>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-body-md-strong text-ink">
          <Link to={`/courses/${id}`} className="line-clamp-1 hover:text-body">
            {title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-caption text-body">
          {description || 'Comprehensive course designed to build practical mastery.'}
        </p>

        <div className="mt-4 flex items-center gap-2 text-caption text-body">
          <Avatar size={22} icon={<UserOutlined />} className="bg-primary text-on-primary" />
          <span className="truncate">{instructorName || 'Lead Instructor'}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-hairline pt-3 text-caption text-body">
          <span className="flex items-center gap-1.5">
            <ReadOutlined />
            <span>{totalLessons} lessons</span>
          </span>
          <span className="flex items-center gap-1.5">
            <TeamOutlined />
            <span>{totalEnrolled} learners</span>
          </span>
        </div>

        {isEnrolled && progress !== null && (
          <div className="mt-4">
            <ProgressBar
              percentage={progress.overallProgressPercentage || progress.progressPercentage || 0}
              completedLessons={progress.completedLessons || 0}
              totalLessons={progress.totalLessons || totalLessons}
              size="small"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="mt-auto flex items-center justify-between gap-3 border-t border-hairline p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          to={`/courses/${id}`}
          className="text-caption text-ink underline underline-offset-4 hover:text-body"
        >
          View Details
        </Link>
        <EnrollmentButton
          courseId={id}
          isEnrolled={isEnrolled}
          onEnrollmentChanged={onEnrollmentChanged}
          size="small"
        />
      </div>
    </article>
  );
};

export default CourseCard;

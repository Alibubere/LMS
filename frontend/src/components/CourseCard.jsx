import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Tag, Typography, Avatar } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import EnrollmentButton from './EnrollmentButton';
import ProgressBar from './ProgressBar';
import { COURSE_STATUS } from '../utils/constants';

const { Title, Paragraph } = Typography;

export const CourseCard = ({
  course,
  isEnrolled = false,
  progress = null,
  showStatus = false,
  onEnrollmentChanged,
}) => {
  const navigate = useNavigate();

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

  const defaultThumbnail = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80`;

  return (
    <Card
      hoverable
      onClick={() => navigate(`/courses/${id}`)}
      cover={
        <div className="relative h-44 overflow-hidden bg-slate-800">
          <img
            alt={title}
            src={thumbnailUrl || defaultThumbnail}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = defaultThumbnail;
            }}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {categoryName && (
              <Tag color="blue" className="font-medium shadow-sm">
                {categoryName}
              </Tag>
            )}
            {showStatus && status && (
              <Tag color={status === COURSE_STATUS.PUBLISHED ? 'success' : 'default'}>
                {status}
              </Tag>
            )}
          </div>
        </div>
      }
      className="flex flex-col h-full rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow border-gray-200"
      styles={{ body: { padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 } }}
    >
      <div className="flex-1">
        <h3 className="font-bold text-base text-gray-900 line-clamp-1 hover:text-blue-600 transition mb-1">
          {title}
        </h3>

        <p className="text-gray-500 text-xs line-clamp-2 mb-3 min-h-[32px]">
          {description || 'Comprehensive course designed to build practical mastery.'}
        </p>

        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
          <Avatar size={20} icon={<UserOutlined />} className="bg-slate-300" />
          <span className="font-medium truncate">{instructorName || 'Lead Instructor'}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2.5 mb-3">
          <div className="flex items-center space-x-1">
            <ReadOutlined className="text-gray-400" />
            <span>{totalLessons} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <TeamOutlined className="text-gray-400" />
            <span>{totalEnrolled} learners</span>
          </div>
        </div>

        {isEnrolled && progress !== null && (
          <div className="mb-3">
            <ProgressBar
              percentage={progress.overallProgressPercentage || progress.progressPercentage || 0}
              completedLessons={progress.completedLessons || 0}
              totalLessons={progress.totalLessons || totalLessons}
              size="small"
            />
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
        <Link
          to={`/courses/${id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
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
    </Card>
  );
};

export default CourseCard;

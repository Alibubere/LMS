import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Popconfirm, message } from 'antd';
import { PlayCircleOutlined, UserAddOutlined, StopOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { enrollmentApi } from '../api';
import { ROLES } from '../utils/constants';

export const EnrollmentButton = ({
  courseId,
  isEnrolled = false,
  onEnrollmentChanged,
  size = 'middle',
  className = '',
  showDropOption = false,
}) => {
  const { isAuthenticated, role, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async (e) => {
    e?.stopPropagation();
    if (!isAuthenticated) {
      message.info('Please log in to enroll in courses');
      navigate(`/login?redirect=/courses/${courseId}`);
      return;
    }

    if (role === ROLES.INSTRUCTOR) {
      message.warning('Instructors cannot enroll as learners.');
      return;
    }

    try {
      setLoading(true);
      await enrollmentApi.enroll(courseId, user?.id);
      message.success('Successfully enrolled! Happy learning!');
      if (onEnrollmentChanged) onEnrollmentChanged(true);
      navigate(`/courses/${courseId}/learn`);
    } catch (err) {
      message.error(err.message || 'Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (e) => {
    e?.stopPropagation();
    try {
      setLoading(true);
      await enrollmentApi.unenroll(courseId, user?.id);
      message.info('You have unenrolled from this course.');
      if (onEnrollmentChanged) onEnrollmentChanged(false);
    } catch (err) {
      message.error(err.message || 'Failed to drop course');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = (e) => {
    e?.stopPropagation();
    navigate(`/courses/${courseId}/learn`);
  };

  if (isEnrolled) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          size={size}
          onClick={handleContinue}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Continue Learning
        </Button>

        {showDropOption && (
          <Popconfirm
            title="Drop this course?"
            description="Are you sure you want to unenroll from this course?"
            onConfirm={handleUnenroll}
            okText="Yes, Drop"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size={size}
              icon={<StopOutlined />}
              loading={loading}
              title="Drop course"
            >
              Drop
            </Button>
          </Popconfirm>
        )}
      </div>
    );
  }

  return (
    <Button
      type="primary"
      icon={<UserAddOutlined />}
      size={size}
      loading={loading}
      onClick={handleEnroll}
      className={`bg-blue-600 hover:bg-blue-700 ${className}`}
    >
      Enroll Now
    </Button>
  );
};

export default EnrollmentButton;

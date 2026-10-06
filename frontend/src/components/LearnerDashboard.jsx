import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tabs, Row, Col, Statistic, Button, Tag, message } from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CompassOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import CourseCard from './CourseCard';
import CertificateCard from './CertificateCard';
import ProgressBar from './ProgressBar';
import LoadingState from './common/LoadingState';
import EmptyState from './common/EmptyState';
import ErrorState from './common/ErrorState';
import { useAuth } from '../hooks/useAuth';
import { enrollmentApi, courseApi, progressApi, certificateApi } from '../api';
import { ENROLLMENT_STATUS } from '../utils/constants';

export const LearnerDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courseMap, setCourseMap] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);

      // Load user enrollments
      const userEnrollments = await enrollmentApi.getUserEnrollments(user.id);
      const enrollmentList = userEnrollments || [];
      setEnrollments(enrollmentList);

      // Load details & progress for each course
      const coursesObj = {};
      const progressObj = {};
      const certList = [];

      for (const e of enrollmentList) {
        try {
          const cData = await courseApi.getCourseById(e.courseId);
          coursesObj[e.courseId] = cData;

          const pData = await progressApi.getCourseProgress(e.courseId);
          progressObj[e.courseId] = pData;

          // If completed, check for certificate
          if (pData?.courseCompleted || e.status === ENROLLMENT_STATUS.COMPLETED) {
            try {
              const cert = await certificateApi.getCertificate(e.courseId);
              if (cert) certList.push(cert);
            } catch (err) {
              // Certificate might not be generated yet
            }
          }
        } catch (err) {
          console.warn('Error loading enrolled course:', e.courseId, err);
        }
      }

      setCourseMap(coursesObj);
      setProgressMap(progressObj);
      setCertificates(certList);
    } catch (err) {
      setError(err.message || 'Failed to load learner dashboard');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <LoadingState tip="Loading your learning workspace..." fullPage />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load your dashboard"
        subTitle={error}
        onRetry={fetchDashboardData}
      />
    );
  }

  const activeEnrollments = enrollments.filter(
    (e) => e.status !== ENROLLMENT_STATUS.COMPLETED && e.status !== ENROLLMENT_STATUS.DROPPED
  );
  const completedEnrollments = enrollments.filter(
    (e) => e.status === ENROLLMENT_STATUS.COMPLETED || progressMap[e.courseId]?.courseCompleted
  );

  const totalLessonsCompleted = Object.values(progressMap).reduce(
    (acc, p) => acc + (p?.completedLessons || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-10 text-white shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200">
            Learner Workspace
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">
            Track your course progress, continue lessons, and view earned certifications.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs hover:shadow-xs transition">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Enrolled Courses</span>}
              value={enrollments.length}
              prefix={<BookOutlined className="text-blue-600 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs hover:shadow-xs transition">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">In Progress</span>}
              value={activeEnrollments.length}
              prefix={<ClockCircleOutlined className="text-amber-500 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs hover:shadow-xs transition">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Completed Courses</span>}
              value={completedEnrollments.length}
              prefix={<CheckCircleOutlined className="text-emerald-500 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs hover:shadow-xs transition">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Certificates</span>}
              value={certificates.length}
              prefix={<TrophyOutlined className="text-purple-600 mr-1" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs: In Progress, Completed, Certificates */}
      <Card className="rounded-2xl border-gray-200 shadow-xs">
        <Tabs
          defaultActiveKey="in_progress"
          size="large"
          items={[
            {
              key: 'in_progress',
              label: `Active Courses (${activeEnrollments.length})`,
              children: (
                <div>
                  {activeEnrollments.length === 0 ? (
                    <EmptyState
                      description="You do not have any courses currently in progress."
                      actionText="Browse Courses"
                      onAction={() => (window.location.href = '/courses')}
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                      {activeEnrollments.map((enr) => {
                        const course = courseMap[enr.courseId] || {
                          id: enr.courseId,
                          title: enr.courseTitle || `Course #${enr.courseId}`,
                        };
                        const progress = progressMap[enr.courseId] || {
                          overallProgressPercentage: enr.progressPercentage || 0,
                        };

                        return (
                          <CourseCard
                            key={enr.id}
                            course={course}
                            isEnrolled={true}
                            progress={progress}
                            onEnrollmentChanged={fetchDashboardData}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'completed',
              label: `Completed (${completedEnrollments.length})`,
              children: (
                <div>
                  {completedEnrollments.length === 0 ? (
                    <EmptyState description="No completed courses yet. Keep learning to achieve your first certificate!" />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                      {completedEnrollments.map((enr) => {
                        const course = courseMap[enr.courseId] || {
                          id: enr.courseId,
                          title: enr.courseTitle || `Course #${enr.courseId}`,
                        };
                        const progress = progressMap[enr.courseId] || {
                          overallProgressPercentage: 100,
                        };

                        return (
                          <CourseCard
                            key={enr.id}
                            course={course}
                            isEnrolled={true}
                            progress={progress}
                            onEnrollmentChanged={fetchDashboardData}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'certificates',
              label: `Certificates (${certificates.length})`,
              children: (
                <div>
                  {certificates.length === 0 ? (
                    <EmptyState description="You have not earned any certificates yet. Complete 100% of a course curriculum to qualify!" />
                  ) : (
                    <div className="space-y-6 pt-2">
                      {certificates.map((cert) => (
                        <CertificateCard key={cert.id} certificate={cert} />
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default LearnerDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs } from 'antd';
import CourseCard from './CourseCard';
import CertificateCard from './CertificateCard';
import LoadingState from './common/LoadingState';
import EmptyState from './common/EmptyState';
import ErrorState from './common/ErrorState';
import { StatTile, SectionHeader } from './ui';
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

      const userEnrollments = await enrollmentApi.getUserEnrollments(user.id);
      const enrollmentList = userEnrollments || [];
      setEnrollments(enrollmentList);

      const coursesObj = {};
      const progressObj = {};
      const certList = [];

      for (const e of enrollmentList) {
        try {
          const cData = await courseApi.getCourseById(e.courseId);
          coursesObj[e.courseId] = cData;

          const pData = await progressApi.getCourseProgress(e.courseId);
          progressObj[e.courseId] = pData;

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

  const stats = [
    { label: 'Enrolled Courses', value: enrollments.length, tone: 'mint' },
    { label: 'In Progress', value: activeEnrollments.length, tone: 'periwinkle' },
    { label: 'Completed Courses', value: completedEnrollments.length, tone: 'mint' },
    { label: 'Certificates', value: certificates.length, tone: 'periwinkle' },
  ];

  const courseGrid = (list, fallbackProgress) => (
    <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((enr) => {
        const course = courseMap[enr.courseId] || {
          id: enr.courseId,
          title: enr.courseTitle || `Course #${enr.courseId}`,
        };
        const progress = progressMap[enr.courseId] || { overallProgressPercentage: fallbackProgress };

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
  );

  const tabItems = [
    {
      key: 'in_progress',
      label: `Active Courses (${activeEnrollments.length})`,
      children:
        activeEnrollments.length === 0 ? (
          <EmptyState
            description="You do not have any courses currently in progress."
            actionText="Browse Courses"
            onAction={() => (window.location.href = '/courses')}
          />
        ) : (
          courseGrid(activeEnrollments, 0)
        ),
    },
    {
      key: 'completed',
      label: `Completed (${completedEnrollments.length})`,
      children:
        completedEnrollments.length === 0 ? (
          <EmptyState description="No completed courses yet. Keep learning to achieve your first certificate!" />
        ) : (
          courseGrid(completedEnrollments, 100)
        ),
    },
    {
      key: 'certificates',
      label: `Certificates (${certificates.length})`,
      children:
        certificates.length === 0 ? (
          <EmptyState description="You have not earned any certificates yet. Complete 100% of a course curriculum to qualify!" />
        ) : (
          <div className="space-y-6 pt-2">
            {certificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome band */}
      <div className="band band-dark bleed -mt-6 md:-mt-10">
        <div className="container-app py-10 md:py-14">
          <p className="eyebrow">Learner workspace</p>
          <h1 className="mt-4 text-display-xl text-on-dark">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="lead mt-4 max-w-2xl">
            Track your course progress, continue lessons, and view earned certifications.
          </p>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatTile key={stat.label} value={stat.value} label={stat.label} tone={stat.tone} />
        ))}
      </div>

      {/* Enrolled courses */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Learning library"
          title="Your courses"
          description="Everything you are enrolled in, with live progress from the gradebook."
        />

        <div className="card">
          <Tabs defaultActiveKey="in_progress" items={tabItems} />
        </div>
      </section>
    </div>
  );
};

export default LearnerDashboard;

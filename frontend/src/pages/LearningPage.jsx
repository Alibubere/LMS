import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Button, Modal, message } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import LessonPlayer from '../components/LessonPlayer';
import ProgressBar from '../components/ProgressBar';
import CertificateCard from '../components/CertificateCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { Badge } from '../components/ui';
import { courseApi, lessonApi, progressApi, certificateApi } from '../api';
import { formatDuration } from '../utils/formatters';

export const LearningPage = () => {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [certificate, setCertificate] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [generatingCert, setGeneratingCert] = useState(false);

  const activeLessonId = searchParams.get('lesson');

  const fetchClassroomData = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);

      const [courseData, lessonsData, progressData] = await Promise.all([
        courseApi.getCourseById(courseId),
        lessonApi.getLessonsByCourse(courseId),
        progressApi.getCourseProgress(courseId),
      ]);

      setCourse(courseData);
      setLessons(lessonsData || []);
      setProgress(progressData);

      const allLessons = lessonsData || [];
      if (allLessons.length > 0) {
        let current = null;
        if (activeLessonId) {
          current = allLessons.find((l) => String(l.id) === String(activeLessonId));
        }
        if (!current) {
          current = allLessons.find((l) => !l.completed) || allLessons[0];
        }
        setSelectedLesson(current);
      }
    } catch (err) {
      setError(err.message || 'Failed to load classroom content');
    } finally {
      setLoading(false);
    }
  }, [courseId, activeLessonId]);

  useEffect(() => {
    fetchClassroomData();
  }, [fetchClassroomData]);

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setSearchParams({ lesson: lesson.id });
  };

  const handleProgressUpdated = async (lessonId, isComplete) => {
    setLessons((prev) => prev.map((l) => (l.id === lessonId ? { ...l, completed: isComplete } : l)));
    if (selectedLesson?.id === lessonId) {
      setSelectedLesson((prev) => (prev ? { ...prev, completed: isComplete } : prev));
    }

    try {
      const updatedProgress = await progressApi.getCourseProgress(courseId);
      setProgress(updatedProgress);

      if (updatedProgress.courseCompleted) {
        message.success('Congratulations! You completed all lessons in this course!');
      }
    } catch (err) {
      console.warn('Failed to refresh progress:', err);
    }
  };

  const currentIndex = lessons.findIndex((l) => l.id === selectedLesson?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < lessons.length - 1;

  const handleNextLesson = () => {
    if (hasNext) handleSelectLesson(lessons[currentIndex + 1]);
  };

  const handlePrevLesson = () => {
    if (hasPrev) handleSelectLesson(lessons[currentIndex - 1]);
  };

  const handleGenerateCertificate = async () => {
    try {
      setGeneratingCert(true);
      const cert = await certificateApi.generateCertificate(courseId);
      setCertificate(cert);
      setIsCertModalOpen(true);
      message.success('Certificate generated successfully!');
    } catch (err) {
      message.error(err.message || 'Failed to generate certificate');
    } finally {
      setGeneratingCert(false);
    }
  };

  if (loading) {
    return <LoadingState tip="Opening your digital classroom..." fullPage />;
  }

  if (error || !course) {
    return (
      <ErrorState
        title="Could not open classroom"
        subTitle={error || 'Course not found or enrollment required'}
        onRetry={fetchClassroomData}
      />
    );
  }

  const isCourseComplete = Boolean(
    progress?.courseCompleted || progress?.overallProgressPercentage >= 100
  );

  return (
    <div className="space-y-6">
      {/* Classroom header bar */}
      <div className="card">
        <div className="card-pad flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Link to={`/courses/${course.id}`}>
              <Button icon={<ArrowLeftOutlined />} shape="circle" title="Back to course overview" />
            </Link>
            <div className="min-w-0">
              <p className="eyebrow">Classroom</p>
              <h1 className="mt-2 truncate text-display-md text-ink">{course.title}</h1>
              <p className="mt-1 text-caption text-body">
                Instructor: {course.instructorName || 'Lead Faculty'}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-80">
            <ProgressBar
              percentage={progress?.overallProgressPercentage || 0}
              completedLessons={progress?.completedLessons || 0}
              totalLessons={progress?.totalLessons || lessons.length}
              size="small"
            />

            {isCourseComplete && (
              <Button
                type="primary"
                icon={<SafetyCertificateOutlined />}
                onClick={handleGenerateCertificate}
                loading={generatingCert}
                size="small"
              >
                Claim / View Certificate
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Split view */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Active lesson */}
        <div className="order-2 lg:order-1 lg:col-span-8">
          <LessonPlayer
            lesson={selectedLesson}
            courseId={course.id}
            onProgressUpdated={handleProgressUpdated}
            onNextLesson={handleNextLesson}
            onPrevLesson={handlePrevLesson}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        </div>

        {/* Curriculum */}
        <div className="order-1 lg:order-2 lg:col-span-4">
          <div className="card sticky top-24">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <p className="eyebrow">Curriculum</p>
              <Badge variant="neutral">{lessons.length} Lessons</Badge>
            </div>

            <div className="max-h-[calc(100vh-240px)] overflow-y-auto p-2">
              {lessons.map((item, index) => {
                const isSelected = selectedLesson?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectLesson(item)}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`flex w-full items-start gap-3 rounded-sm px-3 py-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-hairline text-ink'
                        : 'text-body hover:bg-hairline hover:text-ink'
                    }`}
                  >
                    <span className="shrink-0 pt-0.5">
                      {item.completed ? (
                        <CheckCircleFilled className="text-base text-ink" />
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-hairline font-mono text-[10px] text-body">
                          {index + 1}
                        </span>
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-caption text-inherit">{item.title}</span>
                      <span className="mt-0.5 block font-mono text-[11px] text-body">
                        {formatDuration(item.durationMinutes)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate modal */}
      <Modal
        title="Your Course Certificate"
        open={isCertModalOpen}
        onCancel={() => setIsCertModalOpen(false)}
        footer={null}
        width={850}
        destroyOnHidden
      >
        <div className="py-4">
          <CertificateCard certificate={certificate} />
        </div>
      </Modal>
    </div>
  );
};

export default LearningPage;

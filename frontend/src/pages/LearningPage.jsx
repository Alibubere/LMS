import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, Tag, Button, Modal, message } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  PlayCircleOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import LessonPlayer from '../components/LessonPlayer';
import ProgressBar from '../components/ProgressBar';
import CertificateCard from '../components/CertificateCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { courseApi, lessonApi, progressApi, certificateApi } from '../api';
import { formatDuration } from '../utils/formatters';

export const LearningPage = () => {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Certificate Modal state
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

      // Determine active lesson
      const allLessons = lessonsData || [];
      if (allLessons.length > 0) {
        let current = null;
        if (activeLessonId) {
          current = allLessons.find((l) => String(l.id) === String(activeLessonId));
        }
        if (!current) {
          // Find first uncompleted lesson, or fall back to first lesson
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

  // Handle lesson selection
  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setSearchParams({ lesson: lesson.id });
  };

  // Progress update callback from LessonPlayer
  const handleProgressUpdated = async (lessonId, isComplete) => {
    // Update local lesson completion
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, completed: isComplete } : l))
    );
    if (selectedLesson?.id === lessonId) {
      setSelectedLesson((prev) => (prev ? { ...prev, completed: isComplete } : prev));
    }

    // Refresh overall course progress
    try {
      const updatedProgress = await progressApi.getCourseProgress(courseId);
      setProgress(updatedProgress);

      if (updatedProgress.courseCompleted) {
        message.success('Congratulations! You completed all lessons in this course! 🎉');
      }
    } catch (err) {
      console.warn('Failed to refresh progress:', err);
    }
  };

  // Lesson navigation
  const currentIndex = lessons.findIndex((l) => l.id === selectedLesson?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < lessons.length - 1;

  const handleNextLesson = () => {
    if (hasNext) {
      handleSelectLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (hasPrev) {
      handleSelectLesson(lessons[currentIndex - 1]);
    }
  };

  // Certificate generation
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

  const isCourseComplete = Boolean(progress?.courseCompleted || progress?.overallProgressPercentage >= 100);

  return (
    <div className="space-y-6">
      {/* Classroom Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link to={`/courses/${course.id}`}>
            <Button icon={<ArrowLeftOutlined />} shape="circle" title="Back to course overview" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              {course.title}
            </h1>
            <span className="text-xs text-gray-400">
              Instructor: {course.instructorName || 'Lead Faculty'}
            </span>
          </div>
        </div>

        <div className="w-full sm:w-80 flex flex-col space-y-2">
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
              className="bg-amber-600 hover:bg-amber-700 font-bold"
              size="small"
            >
              Claim / View Certificate
            </Button>
          )}
        </div>
      </div>

      {/* Main Classroom split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Lesson Player (8 cols) */}
        <div className="lg:col-span-8 order-2 lg:order-1">
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

        {/* Right: Lesson Syllabus Nav (4 cols) */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <Card
            className="rounded-2xl border-gray-200 shadow-xs sticky top-24"
            title={
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">Curriculum</span>
                <Tag color="blue">{lessons.length} Lessons</Tag>
              </div>
            }
            styles={{ body: { padding: '8px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' } }}
          >
            <div className="space-y-1">
              {lessons.map((item, index) => {
                const isSelected = selectedLesson?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectLesson(item)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-2xs font-semibold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckCircleFilled className="text-emerald-500 text-base" />
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {formatDuration(item.durationMinutes)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Certificate Modal */}
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

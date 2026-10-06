import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, Tag, Avatar, Card, List, Button, message } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  MessageOutlined,
  StarOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import EnrollmentButton from './EnrollmentButton';
import ProgressBar from './ProgressBar';
import DiscussionList from './DiscussionList';
import FeedbackForm from './FeedbackForm';
import LoadingState from './common/LoadingState';
import ErrorState from './common/ErrorState';
import { courseApi, lessonApi, progressApi, enrollmentApi, quizApi } from '../api';
import { useAuth } from '../hooks/useAuth';
import { formatDuration } from '../utils/formatters';

export const CourseDetails = ({ courseId: propCourseId }) => {
  const { id: routeCourseId } = useParams();
  const courseId = propCourseId || routeCourseId;
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);

      // Load course details
      const courseData = await courseApi.getCourseById(courseId);
      setCourse(courseData);

      // Load lessons
      try {
        const lessonData = await lessonApi.getLessonsByCourse(courseId);
        setLessons(lessonData || []);
      } catch (e) {
        setLessons([]);
      }

      // Load quizzes
      try {
        const quizData = await quizApi.getQuizzesByCourse(courseId);
        setQuizzes(quizData || []);
      } catch (e) {
        setQuizzes([]);
      }

      // If user is authenticated, check enrollment & progress
      if (user?.id) {
        try {
          const userEnrollments = await enrollmentApi.getUserEnrollments(user.id);
          const enrolled = (userEnrollments || []).some(
            (e) => String(e.courseId) === String(courseId)
          );
          setIsEnrolled(enrolled);

          if (enrolled) {
            const progressData = await progressApi.getCourseProgress(courseId);
            setProgress(progressData);
          }
        } catch (e) {
          // Non-blocking
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  }, [courseId, user]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  if (loading) {
    return <LoadingState tip="Loading course information..." fullPage />;
  }

  if (error || !course) {
    return (
      <ErrorState
        title="Could not load course"
        subTitle={error || 'The requested course does not exist.'}
        onRetry={fetchCourseData}
      />
    );
  }

  const defaultThumbnail = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80`;

  const tabItems = [
    {
      key: 'syllabus',
      label: (
        <span>
          <ReadOutlined /> Syllabus ({lessons.length} lessons)
        </span>
      ),
      children: (
        <div className="space-y-4">
          <List
            itemLayout="horizontal"
            dataSource={lessons}
            locale={{ emptyText: 'No lessons added yet for this course.' }}
            renderItem={(item, index) => (
              <List.Item
                className="hover:bg-gray-50/70 p-4 rounded-xl border border-gray-100 mb-2 transition"
                actions={[
                  isEnrolled ? (
                    <Link to={`/courses/${course.id}/learn?lesson=${item.id}`}>
                      <Button
                        type={item.completed ? 'default' : 'primary'}
                        size="small"
                        icon={item.completed ? <CheckCircleOutlined className="text-emerald-500" /> : <PlayCircleOutlined />}
                        className={!item.completed ? 'bg-blue-600' : ''}
                      >
                        {item.completed ? 'Review' : 'Play'}
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400">Enroll to access</span>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                  }
                  title={
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{item.title}</span>
                      {item.completed && <Tag color="success">Completed</Tag>}
                    </div>
                  }
                  description={
                    <div className="text-xs text-gray-500 flex items-center space-x-3 mt-1">
                      <span>{formatDuration(item.durationMinutes)}</span>
                      {item.description && <span>• {item.description}</span>}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: 'quizzes',
      label: (
        <span>
          <QuestionCircleOutlined /> Assessments ({quizzes.length})
        </span>
      ),
      children: (
        <div className="space-y-4">
          <List
            dataSource={quizzes}
            locale={{ emptyText: 'No assessments attached to this course.' }}
            renderItem={(quiz) => (
              <Card className="rounded-xl border-gray-200 mb-3 hover:shadow-xs transition">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-base text-gray-900">{quiz.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{quiz.description || 'Test your knowledge on course topics'}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
                      <span>Passing Score: {quiz.passingScore}%</span>
                      {quiz.timeLimitMinutes && <span>Time Limit: {quiz.timeLimitMinutes} mins</span>}
                      <span>Questions: {quiz.totalQuestions || (quiz.questions ? quiz.questions.length : 0)}</span>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <Link to={`/quizzes/${quiz.id}`}>
                      <Button type="primary" className="bg-indigo-600 hover:bg-indigo-700">
                        Take Assessment
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400">Enroll to participate</span>
                  )}
                </div>
              </Card>
            )}
          />
        </div>
      ),
    },
    {
      key: 'discussions',
      label: (
        <span>
          <MessageOutlined /> Discussions
        </span>
      ),
      children: <DiscussionList courseId={course.id} />,
    },
    {
      key: 'reviews',
      label: (
        <span>
          <StarOutlined /> Reviews & Feedback
        </span>
      ),
      children: <FeedbackForm courseId={course.id} isEnrolled={isEnrolled} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Course Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-md">
        <div className="absolute inset-0 opacity-20">
          <img
            src={course.thumbnailUrl || defaultThumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-6 sm:p-10 z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {course.categoryName && <Tag color="blue">{course.categoryName}</Tag>}
            <Tag color="cyan">{course.status}</Tag>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {course.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300 pt-2">
            <div className="flex items-center space-x-2">
              <Avatar icon={<UserOutlined />} className="bg-blue-600" />
              <span>Instructor: <strong className="text-white">{course.instructorName || 'Lead Faculty'}</strong></span>
            </div>
            <div>
              <strong>{course.totalLessons || lessons.length}</strong> Lessons
            </div>
            <div>
              <strong>{course.totalEnrolled || 0}</strong> Students Enrolled
            </div>
          </div>

          {/* Progress if enrolled */}
          {isEnrolled && progress && (
            <div className="bg-slate-800/80 backdrop-blur-xs p-4 rounded-xl border border-slate-700 max-w-lg mt-4">
              <div className="text-xs font-semibold text-slate-300 mb-1">Your Learning Progress</div>
              <ProgressBar
                percentage={progress.overallProgressPercentage || 0}
                completedLessons={progress.completedLessons || 0}
                totalLessons={progress.totalLessons || lessons.length}
              />
            </div>
          )}

          <div className="pt-4 flex items-center space-x-3">
            <EnrollmentButton
              courseId={course.id}
              isEnrolled={isEnrolled}
              onEnrollmentChanged={(enrolled) => {
                setIsEnrolled(enrolled);
                fetchCourseData();
              }}
              size="large"
              showDropOption={true}
            />
            {isEnrolled && (
              <Link to={`/courses/${course.id}/learn`}>
                <Button size="large" icon={<PlayCircleOutlined />} className="font-medium">
                  Go to Classroom
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Syllabus, Assessments, Discussions, Feedback */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200">
        <Tabs defaultActiveKey="syllabus" items={tabItems} size="large" />
      </div>
    </div>
  );
};

export default CourseDetails;

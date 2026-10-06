import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Popconfirm,
  message,
  Tabs,
  Space,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { courseApi, lessonApi, quizApi, categoryApi } from '../api';
import { useAuth } from '../hooks/useAuth';
import { COURSE_STATUS } from '../utils/constants';
import LoadingState from './common/LoadingState';
import ErrorState from './common/ErrorState';
import EmptyState from './common/EmptyState';

const { TextArea } = Input;
const { Option } = Select;

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected course for lesson/quiz management
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [courseQuizzes, setCourseQuizzes] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Course Modal state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm] = Form.useForm();
  const [savingCourse, setSavingCourse] = useState(false);

  // Lesson Modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm] = Form.useForm();
  const [savingLesson, setSavingLesson] = useState(false);

  // Quiz Modal state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm] = Form.useForm();
  const [savingQuiz, setSavingQuiz] = useState(false);

  // Results Modal state
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const fetchInstructorData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseData, catData] = await Promise.all([
        courseApi.getAllCourses(),
        categoryApi.getAllCategories(),
      ]);

      // Filter courses where current user is instructor (or show all if admin)
      const myCourses =
        user?.role === 'ADMIN'
          ? courseData || []
          : (courseData || []).filter((c) => c.instructorId === user?.id);

      setCourses(myCourses);
      setCategories(catData || []);
    } catch (err) {
      setError(err.message || 'Failed to load instructor dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInstructorData();
  }, [fetchInstructorData]);

  // Load details when a course is selected
  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    try {
      setDetailLoading(true);
      const [lessons, quizzes] = await Promise.all([
        lessonApi.getLessonsByCourse(course.id),
        quizApi.getQuizzesByCourse(course.id),
      ]);
      setCourseLessons(lessons || []);
      setCourseQuizzes(quizzes || []);
    } catch (err) {
      message.error(err.message || 'Failed to load course details');
    } finally {
      setDetailLoading(false);
    }
  };

  // Course CRUD
  const handleOpenCourseModal = (course = null) => {
    setEditingCourse(course);
    if (course) {
      courseForm.setFieldsValue({
        title: course.title,
        description: course.description,
        categoryId: course.categoryId,
        status: course.status || COURSE_STATUS.PUBLISHED,
        thumbnailUrl: course.thumbnailUrl,
      });
    } else {
      courseForm.resetFields();
      courseForm.setFieldsValue({
        status: COURSE_STATUS.PUBLISHED,
      });
    }
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (values) => {
    try {
      setSavingCourse(true);
      if (editingCourse) {
        await courseApi.updateCourse(editingCourse.id, values);
        message.success('Course updated successfully');
      } else {
        await courseApi.createCourse(values);
        message.success('Course created successfully');
      }
      setIsCourseModalOpen(false);
      fetchInstructorData();
    } catch (err) {
      message.error(err.message || 'Failed to save course');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await courseApi.deleteCourse(courseId);
      message.success('Course deleted');
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
      }
      fetchInstructorData();
    } catch (err) {
      message.error(err.message || 'Failed to delete course');
    }
  };

  // Lesson CRUD
  const handleOpenLessonModal = (lesson = null) => {
    setEditingLesson(lesson);
    if (lesson) {
      lessonForm.setFieldsValue({
        title: lesson.title,
        description: lesson.description,
        contentUrl: lesson.contentUrl,
        contentText: lesson.contentText,
        durationMinutes: lesson.durationMinutes,
        orderIndex: lesson.orderIndex,
      });
    } else {
      lessonForm.resetFields();
      lessonForm.setFieldsValue({
        orderIndex: courseLessons.length + 1,
        durationMinutes: 15,
      });
    }
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (values) => {
    if (!selectedCourse) return;
    try {
      setSavingLesson(true);
      if (editingLesson) {
        await lessonApi.updateLesson(editingLesson.id, values);
        message.success('Lesson updated');
      } else {
        await lessonApi.createLesson(selectedCourse.id, values);
        message.success('Lesson added to course');
      }
      setIsLessonModalOpen(false);
      handleSelectCourse(selectedCourse);
    } catch (err) {
      message.error(err.message || 'Failed to save lesson');
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await lessonApi.deleteLesson(lessonId);
      message.success('Lesson deleted');
      handleSelectCourse(selectedCourse);
    } catch (err) {
      message.error(err.message || 'Failed to delete lesson');
    }
  };

  // Quiz CRUD
  const handleOpenQuizModal = (quiz = null) => {
    setEditingQuiz(quiz);
    if (quiz) {
      quizForm.setFieldsValue({
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        timeLimitMinutes: quiz.timeLimitMinutes,
      });
    } else {
      quizForm.resetFields();
      quizForm.setFieldsValue({
        passingScore: 70,
        timeLimitMinutes: 20,
        questions: [
          {
            questionText: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctOption: 'A',
            points: 1,
            explanation: '',
          },
        ],
      });
    }
    setIsQuizModalOpen(true);
  };

  const handleSaveQuiz = async (values) => {
    if (!selectedCourse) return;
    try {
      setSavingQuiz(true);
      if (editingQuiz) {
        await quizApi.updateQuiz(editingQuiz.id, values);
        message.success('Quiz updated');
      } else {
        await quizApi.createQuiz(selectedCourse.id, values);
        message.success('Quiz created for course');
      }
      setIsQuizModalOpen(false);
      handleSelectCourse(selectedCourse);
    } catch (err) {
      message.error(err.message || 'Failed to save quiz');
    } finally {
      setSavingQuiz(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await quizApi.deleteQuiz(quizId);
      message.success('Quiz deleted');
      handleSelectCourse(selectedCourse);
    } catch (err) {
      message.error(err.message || 'Failed to delete quiz');
    }
  };

  const handleViewResults = async (quiz) => {
    try {
      setLoadingResults(true);
      setIsResultsModalOpen(true);
      const results = await quizApi.getQuizResults(quiz.id);
      setQuizResults(results || []);
    } catch (err) {
      message.error(err.message || 'Failed to load results');
    } finally {
      setLoadingResults(false);
    }
  };

  if (loading) {
    return <LoadingState tip="Loading instructor workspace..." fullPage />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load instructor workspace"
        subTitle={error}
        onRetry={fetchInstructorData}
      />
    );
  }

  const totalStudents = courses.reduce((sum, c) => sum + (c.totalEnrolled || 0), 0);
  const totalCourseLessons = courses.reduce((sum, c) => sum + (c.totalLessons || 0), 0);

  const courseColumns = [
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <span className="font-bold text-gray-900 block">{text}</span>
          <span className="text-xs text-gray-400">{record.categoryName || 'General'}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st) => (
        <Tag color={st === COURSE_STATUS.PUBLISHED ? 'success' : 'default'}>{st}</Tag>
      ),
    },
    {
      title: 'Lessons',
      dataIndex: 'totalLessons',
      key: 'totalLessons',
      render: (v) => <span>{v || 0}</span>,
    },
    {
      title: 'Enrollments',
      dataIndex: 'totalEnrolled',
      key: 'totalEnrolled',
      render: (v) => <span>{v || 0}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type={selectedCourse?.id === record.id ? 'primary' : 'default'}
            onClick={() => handleSelectCourse(record)}
            className={selectedCourse?.id === record.id ? 'bg-blue-600' : ''}
          >
            Manage Content
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenCourseModal(record)}
          />
          <Popconfirm
            title="Delete this course?"
            description="All lessons and enrolled student data will be removed."
            onConfirm={() => handleDeleteCourse(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-200">
            Instructor Studio
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Course Management & Curriculum
          </h1>
          <p className="text-amber-100 text-sm mt-1">
            Author courses, publish lessons, create quizzes, and monitor learner submissions.
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => handleOpenCourseModal()}
          className="bg-white text-orange-600 hover:bg-amber-50 font-bold border-0 shadow-sm"
        >
          Create Course
        </Button>
      </div>

      {/* Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">My Courses</span>}
              value={courses.length}
              prefix={<BookOutlined className="text-orange-500 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Total Enrolled</span>}
              value={totalStudents}
              prefix={<TeamOutlined className="text-blue-500 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Total Lessons</span>}
              value={totalCourseLessons}
              prefix={<FileTextOutlined className="text-emerald-500 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Course Categories</span>}
              value={categories.length}
              prefix={<CheckCircleOutlined className="text-purple-500 mr-1" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Courses List Table */}
      <Card
        className="rounded-2xl border-gray-200 shadow-xs"
        title={<span className="font-bold text-gray-900">Courses Directory</span>}
      >
        <Table
          columns={courseColumns}
          dataSource={courses}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 600 }}
        />
      </Card>

      {/* Selected Course Content Manager */}
      {selectedCourse && (
        <Card
          className="rounded-2xl border-blue-200 bg-blue-50/20 shadow-xs"
          title={
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase text-blue-600 font-bold block">
                  Active Course Curriculum
                </span>
                <span className="text-lg font-extrabold text-gray-900">
                  {selectedCourse.title}
                </span>
              </div>
              <Tag color="blue">{selectedCourse.categoryName || 'General'}</Tag>
            </div>
          }
        >
          {detailLoading ? (
            <LoadingState tip="Loading course content..." />
          ) : (
            <Tabs
              defaultActiveKey="lessons"
              items={[
                {
                  key: 'lessons',
                  label: (
                    <span>
                      <FileTextOutlined /> Lessons ({courseLessons.length})
                    </span>
                  ),
                  children: (
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => handleOpenLessonModal()}
                          className="bg-blue-600"
                        >
                          Add Lesson
                        </Button>
                      </div>

                      <Table
                        dataSource={courseLessons}
                        rowKey="id"
                        pagination={false}
                        columns={[
                          {
                            title: 'Order',
                            dataIndex: 'orderIndex',
                            key: 'orderIndex',
                            width: 80,
                          },
                          {
                            title: 'Lesson Title',
                            dataIndex: 'title',
                            key: 'title',
                            render: (t) => <strong className="text-gray-900">{t}</strong>,
                          },
                          {
                            title: 'Duration',
                            dataIndex: 'durationMinutes',
                            key: 'durationMinutes',
                            render: (d) => `${d || 0} min`,
                          },
                          {
                            title: 'Content Resource',
                            dataIndex: 'contentUrl',
                            key: 'contentUrl',
                            render: (u) =>
                              u ? (
                                <a
                                  href={u}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-600 truncate max-w-xs block"
                                >
                                  {u}
                                </a>
                              ) : (
                                <span className="text-xs text-gray-400">Written text</span>
                              ),
                          },
                          {
                            title: 'Actions',
                            key: 'actions',
                            render: (_, item) => (
                              <Space size="small">
                                <Button
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => handleOpenLessonModal(item)}
                                />
                                <Popconfirm
                                  title="Delete this lesson?"
                                  onConfirm={() => handleDeleteLesson(item.id)}
                                  okText="Delete"
                                  okButtonProps={{ danger: true }}
                                >
                                  <Button size="small" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </div>
                  ),
                },
                {
                  key: 'quizzes',
                  label: (
                    <span>
                      <QuestionCircleOutlined /> Assessments ({courseQuizzes.length})
                    </span>
                  ),
                  children: (
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => handleOpenQuizModal()}
                          className="bg-indigo-600"
                        >
                          Create Assessment
                        </Button>
                      </div>

                      <Table
                        dataSource={courseQuizzes}
                        rowKey="id"
                        pagination={false}
                        columns={[
                          {
                            title: 'Quiz Title',
                            dataIndex: 'title',
                            key: 'title',
                            render: (t) => <strong className="text-gray-900">{t}</strong>,
                          },
                          {
                            title: 'Passing Score',
                            dataIndex: 'passingScore',
                            key: 'passingScore',
                            render: (s) => `${s}%`,
                          },
                          {
                            title: 'Time Limit',
                            dataIndex: 'timeLimitMinutes',
                            key: 'timeLimitMinutes',
                            render: (m) => (m ? `${m} mins` : 'No limit'),
                          },
                          {
                            title: 'Questions',
                            dataIndex: 'totalQuestions',
                            key: 'totalQuestions',
                            render: (q, rec) => q || (rec.questions ? rec.questions.length : 0),
                          },
                          {
                            title: 'Actions',
                            key: 'actions',
                            render: (_, item) => (
                              <Space size="small">
                                <Button
                                  size="small"
                                  onClick={() => handleViewResults(item)}
                                >
                                  View Submissions
                                </Button>
                                <Button
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => handleOpenQuizModal(item)}
                                />
                                <Popconfirm
                                  title="Delete this assessment?"
                                  onConfirm={() => handleDeleteQuiz(item.id)}
                                  okText="Delete"
                                  okButtonProps={{ danger: true }}
                                >
                                  <Button size="small" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </div>
                  ),
                },
              ]}
            />
          )}
        </Card>
      )}

      {/* Course Modal */}
      <Modal
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
        open={isCourseModalOpen}
        onCancel={() => setIsCourseModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={courseForm} layout="vertical" onFinish={handleSaveCourse} className="mt-4">
          <Form.Item
            name="title"
            label="Course Title"
            rules={[{ required: true, message: 'Please enter course title' }]}
          >
            <Input placeholder="e.g. Full Stack Spring & React" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter course description' }]}
          >
            <TextArea rows={4} placeholder="Comprehensive description of the course..." />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Publishing Status">
            <Select>
              <Option value={COURSE_STATUS.PUBLISHED}>PUBLISHED</Option>
              <Option value={COURSE_STATUS.DRAFT}>DRAFT</Option>
              <Option value={COURSE_STATUS.ARCHIVED}>ARCHIVED</Option>
            </Select>
          </Form.Item>

          <Form.Item name="thumbnailUrl" label="Thumbnail Image URL">
            <Input placeholder="https://example.com/thumbnail.jpg" />
          </Form.Item>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={() => setIsCourseModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={savingCourse} className="bg-blue-600">
              Save Course
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Lesson Modal */}
      <Modal
        title={editingLesson ? 'Edit Lesson' : 'Add Lesson'}
        open={isLessonModalOpen}
        onCancel={() => setIsLessonModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={lessonForm} layout="vertical" onFinish={handleSaveLesson} className="mt-4">
          <Form.Item
            name="title"
            label="Lesson Title"
            rules={[{ required: true, message: 'Please enter lesson title' }]}
          >
            <Input placeholder="e.g. Introduction to Component Lifecycle" />
          </Form.Item>

          <Form.Item name="description" label="Summary / Objectives">
            <Input placeholder="Brief synopsis of what learners will study" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="durationMinutes" label="Duration (Minutes)">
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="orderIndex" label="Order Index">
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="contentUrl" label="Video or External URL">
            <Input placeholder="https://www.youtube.com/watch?v=... or direct MP4 link" />
          </Form.Item>

          <Form.Item name="contentText" label="Reading Material / Code Notes">
            <TextArea rows={4} placeholder="Full lesson notes, Markdown, code snippets, etc." />
          </Form.Item>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={() => setIsLessonModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={savingLesson} className="bg-blue-600">
              Save Lesson
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        title={editingQuiz ? 'Edit Quiz' : 'Create Assessment'}
        open={isQuizModalOpen}
        onCancel={() => setIsQuizModalOpen(false)}
        footer={null}
        width={700}
        destroyOnHidden
      >
        <Form form={quizForm} layout="vertical" onFinish={handleSaveQuiz} className="mt-4">
          <Form.Item
            name="title"
            label="Assessment Title"
            rules={[{ required: true, message: 'Please enter assessment title' }]}
          >
            <Input placeholder="e.g. Midterm Comprehensive Quiz" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input placeholder="Instructions and objectives" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="passingScore"
                label="Passing Score (%)"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={100} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="timeLimitMinutes" label="Time Limit (Minutes)">
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          {!editingQuiz && (
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="font-bold text-sm text-gray-800">
                      Assessment Questions
                    </span>
                    <Button
                      type="dashed"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => add({ correctOption: 'A', points: 1 })}
                    >
                      Add Question
                    </Button>
                  </div>

                  {fields.map(({ key, name, ...restField }, idx) => (
                    <Card
                      key={key}
                      size="small"
                      className="bg-gray-50 border-gray-200 rounded-xl"
                      title={`Question ${idx + 1}`}
                      extra={
                        fields.length > 1 && (
                          <Button
                            danger
                            type="text"
                            size="small"
                            onClick={() => remove(name)}
                          >
                            Remove
                          </Button>
                        )
                      }
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'questionText']}
                        label="Question Prompt"
                        rules={[{ required: true, message: 'Question prompt is required' }]}
                      >
                        <Input placeholder="e.g. What is the default port of Spring Boot?" />
                      </Form.Item>

                      <Row gutter={8}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'optionA']}
                            label="Option A"
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'optionB']}
                            label="Option B"
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={8}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'optionC']}
                            label="Option C"
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'optionD']}
                            label="Option D"
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={8}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'correctOption']}
                            label="Correct Option"
                            rules={[{ required: true }]}
                          >
                            <Select>
                              <Option value="A">Option A</Option>
                              <Option value="B">Option B</Option>
                              <Option value="C">Option C</Option>
                              <Option value="D">Option D</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item {...restField} name={[name, 'points']} label="Points">
                            <InputNumber min={1} className="w-full" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        {...restField}
                        name={[name, 'explanation']}
                        label="Explanation / Key rationale"
                      >
                        <Input placeholder="Why this option is correct" />
                      </Form.Item>
                    </Card>
                  ))}
                </div>
              )}
            </Form.List>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
            <Button onClick={() => setIsQuizModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={savingQuiz} className="bg-indigo-600">
              Save Assessment
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Submissions Modal */}
      <Modal
        title="Learner Submissions & Performance"
        open={isResultsModalOpen}
        onCancel={() => setIsResultsModalOpen(false)}
        footer={null}
        width={750}
      >
        {loadingResults ? (
          <LoadingState tip="Loading learner attempts..." />
        ) : quizResults.length === 0 ? (
          <EmptyState description="No learners have submitted attempts for this quiz yet." />
        ) : (
          <Table
            dataSource={quizResults}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: 'Learner',
                dataIndex: 'userName',
                key: 'userName',
                render: (name) => <strong>{name || 'Student'}</strong>,
              },
              {
                title: 'Score',
                key: 'score',
                render: (_, r) => `${r.score} / ${r.totalPoints}`,
              },
              {
                title: 'Percentage',
                dataIndex: 'percentage',
                key: 'percentage',
                render: (p) => `${p}%`,
              },
              {
                title: 'Status',
                dataIndex: 'passed',
                key: 'passed',
                render: (pass) => (
                  <Tag color={pass ? 'success' : 'error'}>{pass ? 'PASSED' : 'FAILED'}</Tag>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
};

export default InstructorDashboard;

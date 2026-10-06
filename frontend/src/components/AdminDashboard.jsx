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
  Popconfirm,
  message,
  Tabs,
  Space,
  Row,
  Col,
  Statistic,
  Avatar,
} from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { userApi, categoryApi, courseApi } from '../api';
import { ROLES, COURSE_STATUS } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import LoadingState from './common/LoadingState';
import ErrorState from './common/ErrorState';

const { TextArea } = Input;
const { Option } = Select;

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm] = Form.useForm();
  const [savingCategory, setSavingCategory] = useState(false);

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, coursesData, categoriesData] = await Promise.all([
        userApi.getAllUsers(),
        courseApi.getAllCourses(),
        categoryApi.getAllCategories(),
      ]);
      setUsers(usersData || []);
      setCourses(coursesData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError(err.message || 'Failed to load administrator data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Category actions
  const handleOpenCategoryModal = (cat = null) => {
    setEditingCategory(cat);
    if (cat) {
      categoryForm.setFieldsValue({
        name: cat.name,
        description: cat.description,
      });
    } else {
      categoryForm.resetFields();
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (values) => {
    try {
      setSavingCategory(true);
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id, values);
        message.success('Category updated successfully');
      } else {
        await categoryApi.createCategory(values);
        message.success('Category created successfully');
      }
      setIsCategoryModalOpen(false);
      fetchAdminData();
    } catch (err) {
      message.error(err.message || 'Failed to save category');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoryApi.deleteCategory(id);
      message.success('Category deleted');
      fetchAdminData();
    } catch (err) {
      message.error(err.message || 'Failed to delete category');
    }
  };

  // Course deletion
  const handleDeleteCourse = async (id) => {
    try {
      await courseApi.deleteCourse(id);
      message.success('Course deleted');
      fetchAdminData();
    } catch (err) {
      message.error(err.message || 'Failed to delete course');
    }
  };

  if (loading) {
    return <LoadingState tip="Loading administrator portal..." fullPage />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load admin portal"
        subTitle={error}
        onRetry={fetchAdminData}
      />
    );
  }

  const learnersCount = users.filter((u) => u.role === ROLES.LEARNER).length;
  const instructorsCount = users.filter((u) => u.role === ROLES.INSTRUCTOR).length;
  const adminsCount = users.filter((u) => u.role === ROLES.ADMIN).length;

  const userColumns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name, rec) => (
        <div className="flex items-center space-x-2">
          <Avatar
            size="small"
            src={rec.avatarUrl}
            icon={!rec.avatarUrl && <UserOutlined />}
            className="bg-blue-600"
          />
          <div>
            <span className="font-semibold text-gray-900 block">{name}</span>
            <span className="text-xs text-gray-400">{rec.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (r) => {
        const color = r === ROLES.ADMIN ? 'red' : r === ROLES.INSTRUCTOR ? 'orange' : 'blue';
        return <Tag color={color}>{r}</Tag>;
      },
    },
    {
      title: 'Joined Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d) => formatDate(d),
    },
  ];

  const categoryColumns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <strong className="text-gray-900">{name}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => <span className="text-gray-500 text-xs">{desc || '—'}</span>,
    },
    {
      title: 'Courses Count',
      dataIndex: 'courseCount',
      key: 'courseCount',
      render: (c) => c || 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, cat) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenCategoryModal(cat)}
          />
          <Popconfirm
            title="Delete this category?"
            onConfirm={() => handleDeleteCategory(cat.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const courseColumns = [
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      render: (t) => <strong className="text-gray-900">{t}</strong>,
    },
    {
      title: 'Instructor',
      dataIndex: 'instructorName',
      key: 'instructorName',
      render: (inst) => inst || 'Unassigned',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (cat) => <Tag color="blue">{cat || 'General'}</Tag>,
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
      title: 'Enrollments',
      dataIndex: 'totalEnrolled',
      key: 'totalEnrolled',
      render: (e) => e || 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, c) => (
        <Popconfirm
          title="Delete this course?"
          description="This action cannot be undone."
          onConfirm={() => handleDeleteCourse(c.id)}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-300">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Platform Command Center
          </h1>
          <p className="text-slate-300 text-sm">
            Control platform taxonomy, monitor user accounts, and oversee learning system health.
          </p>
        </div>
      </div>

      {/* KPI stats */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Total Users</span>}
              value={users.length}
              prefix={<TeamOutlined className="text-blue-500 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Total Courses</span>}
              value={courses.length}
              prefix={<BookOutlined className="text-emerald-500 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Categories</span>}
              value={categories.length}
              prefix={<AppstoreOutlined className="text-purple-500 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="rounded-2xl border-gray-200 shadow-2xs">
            <Statistic
              title={<span className="text-xs font-semibold text-gray-500">Instructors</span>}
              value={instructorsCount}
              prefix={<SafetyOutlined className="text-amber-500 mr-1" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Admin Management Tabs */}
      <Card className="rounded-2xl border-gray-200 shadow-xs">
        <Tabs
          defaultActiveKey="users"
          size="large"
          items={[
            {
              key: 'users',
              label: (
                <span>
                  <TeamOutlined /> Users Directory ({users.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={users}
                  columns={userColumns}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  scroll={{ x: 600 }}
                />
              ),
            },
            {
              key: 'categories',
              label: (
                <span>
                  <AppstoreOutlined /> Categories ({categories.length})
                </span>
              ),
              children: (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleOpenCategoryModal()}
                      className="bg-blue-600"
                    >
                      New Category
                    </Button>
                  </div>
                  <Table
                    dataSource={categories}
                    columns={categoryColumns}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                  />
                </div>
              ),
            },
            {
              key: 'courses',
              label: (
                <span>
                  <BookOutlined /> All Courses ({courses.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={courses}
                  columns={courseColumns}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  scroll={{ x: 600 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={categoryForm} layout="vertical" onFinish={handleSaveCategory} className="mt-4">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="e.g. Computer Science, Cloud & DevOps" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Brief summary of topics encompassed" />
          </Form.Item>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={savingCategory} className="bg-blue-600">
              Save Category
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

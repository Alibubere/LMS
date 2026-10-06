import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Tabs,
  Space,
  Avatar,
} from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  AppstoreOutlined,
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
import { StatTile, Badge } from './ui';

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
            
          />
          <div>
            <span className="block font-semibold text-ink">{name}</span>
            <span className="text-caption text-body">{rec.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (r) => {
        const variant =
          r === ROLES.ADMIN ? 'danger' : r === ROLES.INSTRUCTOR ? 'warning' : 'outline';
        return <Badge variant={variant}>{r}</Badge>;
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
      render: (name) => <strong className="font-semibold text-ink">{name}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => <span className="text-caption text-body">{desc || '—'}</span>,
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
      render: (t) => <strong className="font-semibold text-ink">{t}</strong>,
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
      render: (cat) => <Badge variant="outline">{cat || 'General'}</Badge>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st) => (
        <Badge variant={st === COURSE_STATUS.PUBLISHED ? 'success' : 'neutral'}>{st}</Badge>
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
      {/* Admin header band */}
      <div className="band band-dark bleed -mt-6 md:-mt-10">
        <div className="container-app py-10 md:py-14">
          <div className="max-w-3xl">
            <p className="eyebrow">System administration</p>
            <h1 className="mt-4 text-display-xl text-on-dark">Platform Command Center</h1>
            <p className="lead mt-4">
              Control platform taxonomy, monitor user accounts, and oversee learning system
              health.
            </p>
          </div>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile value={users.length} label="Total Users" tone="mint" />
        <StatTile value={courses.length} label="Total Courses" tone="periwinkle" />
        <StatTile value={categories.length} label="Categories" tone="mint" />
        <StatTile value={instructorsCount} label="Instructors" tone="periwinkle" />
      </div>

      {/* Admin Management Tabs */}
      <div className="card">
        <div className="px-6 pt-4 pb-6 md:px-8">
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
        </div>
      </div>

      {/* Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        footer={null}
        destroyOnHidden
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
            <Button type="primary" htmlType="submit" loading={savingCategory} >
              Save Category
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

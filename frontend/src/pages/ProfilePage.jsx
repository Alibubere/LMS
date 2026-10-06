import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Tag, message } from 'antd';
import { UserOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api';
import { formatDate } from '../utils/formatters';

const { TextArea } = Input;

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleUpdate = async (values) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const updated = await userApi.updateUser(user.id, {
        name: values.name.trim(),
        bio: values.bio?.trim(),
        avatarUrl: values.avatarUrl?.trim(),
      });
      updateProfile(updated);
      message.success('Profile updated successfully!');
    } catch (err) {
      message.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="rounded-2xl border-gray-200 shadow-xs p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left border-b border-gray-100 pb-6 mb-6">
          <Avatar
            size={80}
            src={user?.avatarUrl}
            icon={!user?.avatarUrl && <UserOutlined />}
            className="bg-blue-600 text-white text-3xl shrink-0"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <Tag color="blue">{user?.role}</Tag>
            </div>
            <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
            <p className="text-gray-400 text-xs mt-2">
              Member since: {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>

        <h3 className="font-bold text-base text-gray-800 mb-4">Edit Profile</h3>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            name: user?.name,
            bio: user?.bio,
            avatarUrl: user?.avatarUrl,
          }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input prefix={<UserOutlined className="text-gray-400" />} />
          </Form.Item>

          <Form.Item name="avatarUrl" label="Avatar Image URL">
            <Input placeholder="https://example.com/avatar.jpg" />
          </Form.Item>

          <Form.Item name="bio" label="Short Bio">
            <TextArea rows={3} placeholder="Tell others about your learning interests and goals..." />
          </Form.Item>

          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Profile Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;

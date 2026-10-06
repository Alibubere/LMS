import React, { useState } from 'react';
import { Form, Input, Button, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api';
import { formatDate } from '../utils/formatters';
import { Badge, SectionHeader } from '../components/ui';

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
    <div className="mx-auto max-w-3xl space-y-8">
      <SectionHeader
        eyebrow="Account"
        title="Profile & Settings"
        description="Manage how you appear across the platform and keep your details up to date."
      />

      {/* Identity card */}
      <div className="card">
        <div className="card-pad-lg flex flex-col items-center gap-5 border-b border-hairline text-center sm:flex-row sm:gap-6 sm:text-left">
          <Avatar
            size={80}
            src={user?.avatarUrl}
            icon={!user?.avatarUrl && <UserOutlined />}
            className="shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h2 className="text-display-md text-ink">{user?.name}</h2>
              <Badge variant="outline">{user?.role}</Badge>
            </div>
            <p className="mt-1 text-body-md text-body">{user?.email}</p>
            <p className="mt-2 text-mono-eyebrow uppercase text-body">
              Member since: {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>

        <div className="card-pad-lg">
          <p className="eyebrow">Edit profile</p>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            className="mt-4"
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
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item name="avatarUrl" label="Avatar Image URL">
              <Input placeholder="https://example.com/avatar.jpg" />
            </Form.Item>

            <Form.Item name="bio" label="Short Bio">
              <TextArea
                rows={3}
                placeholder="Tell others about your learning interests and goals..."
              />
            </Form.Item>

            <div className="flex justify-end">
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Profile Changes
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert, Typography, Radio } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

const { Title, Text } = Typography;

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const registeredUser = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role || ROLES.LEARNER,
      });

      if (registeredUser.role === ROLES.INSTRUCTOR) {
        navigate('/instructor');
      } else {
        navigate('/learner');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md rounded-2xl shadow-md border-gray-200 p-2 sm:p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <BookOutlined className="text-2xl" />
          </div>
          <Title level={3} className="!mb-1">
            Create Your Account
          </Title>
          <Text type="secondary" className="text-sm">
            Join the LMS community today
          </Text>
        </div>

        {errorMessage && (
          <Alert
            message="Registration Error"
            description={errorMessage}
            type="error"
            showIcon
            className="mb-6 rounded-xl"
            closable
            onClose={() => setErrorMessage(null)}
          />
        )}

        <Form
          name="registerForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
          initialValues={{ role: ROLES.LEARNER }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, max: 100, message: 'Name must be between 2 and 100 characters' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400 mr-1" />}
              placeholder="Alex Johnson"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400 mr-1" />}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400 mr-1" />}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item name="role" label="I want to join as a">
            <Radio.Group className="w-full grid grid-cols-2 gap-2">
              <Radio.Button value={ROLES.LEARNER} className="text-center h-10 flex items-center justify-center font-medium">
                Learner
              </Radio.Button>
              <Radio.Button value={ROLES.INSTRUCTOR} className="text-center h-10 flex items-center justify-center font-medium">
                Instructor
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-blue-600 hover:bg-blue-700 h-11 font-bold rounded-xl shadow-xs"
            >
              Register & Continue
            </Button>
          </Form.Item>

          <div className="text-center mt-4 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;

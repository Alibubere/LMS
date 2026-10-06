import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Input, Button, Alert, Typography } from 'antd';
import { MailOutlined, LockOutlined, BookOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

const { Title, Text } = Typography;

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect');

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const loggedInUser = await login({
        email: values.email.trim(),
        password: values.password,
      });

      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (loggedInUser.role === ROLES.ADMIN) {
        navigate('/admin');
      } else if (loggedInUser.role === ROLES.INSTRUCTOR) {
        navigate('/instructor');
      } else {
        navigate('/learner');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
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
            Welcome Back
          </Title>
          <Text type="secondary" className="text-sm">
            Sign in to continue your learning journey
          </Text>
        </div>

        {errorMessage && (
          <Alert
            message="Sign In Failed"
            description={errorMessage}
            type="error"
            showIcon
            className="mb-6 rounded-xl"
            closable
            onClose={() => setErrorMessage(null)}
          />
        )}

        <Form
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
        >
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
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400 mr-1" />}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-blue-600 hover:bg-blue-700 h-11 font-bold rounded-xl shadow-xs"
            >
              Log In
            </Button>
          </Form.Item>

          <div className="text-center mt-4 text-sm text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Create an account
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;

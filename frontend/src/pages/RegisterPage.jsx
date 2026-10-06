import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Radio } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import { GradientRibbon } from '../components/ui';

const ASSURANCES = [
  'Free account, no card required',
  'Choose your track now, switch later',
  'Certificates issued the moment you pass',
];

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
    <section className="band band-dark bleed -mt-6 min-h-[70vh] md:-mt-10">
      <div className="container-app py-14 md:py-section">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---------------- Value panel */}
          <div className="max-w-xl space-y-6">
            <p className="eyebrow">Create account</p>
            <h1 className="text-display-xxl text-on-dark">Create Your Account</h1>
            <p className="lead">Join the platform and start a structured learning track today.</p>

            <div className="relative hidden max-w-md lg:block">
              <GradientRibbon />
            </div>

            <ul className="space-y-3 border-t border-hairline-dark pt-6">
              {ASSURANCES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircleFilled className="mt-0.5 text-accent-mint" />
                  <span className="text-body-md text-on-dark">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- Form card */}
          <div className="card w-full max-w-[520px] justify-self-center lg:justify-self-end">
            <div className="card-pad-lg">
              <p className="eyebrow">New account</p>
              <h2 className="mt-3 text-display-lg text-ink">Register in under a minute</h2>

              {errorMessage && (
                <Alert
                  message="Registration Error"
                  description={errorMessage}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setErrorMessage(null)}
                  className="mt-6"
                />
              )}

              <Form
                name="registerForm"
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                size="large"
                initialValues={{ role: ROLES.LEARNER }}
                className="mt-6"
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
                    prefix={<UserOutlined className="mr-1 text-body" />}
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
                    prefix={<MailOutlined className="mr-1 text-body" />}
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
                    prefix={<LockOutlined className="mr-1 text-body" />}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item name="role" label="I want to join as a">
                  <Radio.Group className="w-full grid grid-cols-2 gap-2">
                    <Radio.Button
                      value={ROLES.LEARNER}
                      className="flex h-10 items-center justify-center text-center font-medium"
                    >
                      Learner
                    </Radio.Button>
                    <Radio.Button
                      value={ROLES.INSTRUCTOR}
                      className="flex h-10 items-center justify-center text-center font-medium"
                    >
                      Instructor
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item className="mt-8 mb-0">
                  <Button type="primary" htmlType="submit" loading={loading} block size="large">
                    Register &amp; Continue
                  </Button>
                </Form.Item>

                <p className="mt-6 text-center text-caption text-body">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-ink underline underline-offset-4 hover:text-body"
                  >
                    Log in
                  </Link>
                </p>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;

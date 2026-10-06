import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, Tag } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  DashboardOutlined,
  MenuOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === ROLES.ADMIN) return '/admin';
    if (role === ROLES.INSTRUCTOR) return '/instructor';
    return '/learner';
  };

  const getRoleTag = () => {
    if (role === ROLES.ADMIN) return <Tag color="error">Admin</Tag>;
    if (role === ROLES.INSTRUCTOR) return <Tag color="warning">Instructor</Tag>;
    return <Tag color="blue">Learner</Tag>;
  };

  const userMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'My Dashboard',
      onClick: () => navigate(getDashboardPath()),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Log Out',
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: mobile hamburger & logo */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                <MenuOutlined className="text-lg" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2.5 text-blue-600 font-bold text-xl hover:opacity-90">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-sm">
                <BookOutlined className="text-lg" />
              </div>
              <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent font-extrabold tracking-tight">
                LMS Portal
              </span>
            </Link>

            {/* Desktop primary links */}
            <nav className="hidden md:flex items-center space-x-1 ml-6">
              <Link
                to="/courses"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                Explore Courses
              </Link>
            </nav>
          </div>

          {/* Right section: user profile or auth actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                >
                  <DashboardOutlined />
                  <span>Dashboard</span>
                </Link>

                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
                  <button className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 transition focus:outline-none cursor-pointer">
                    <Avatar
                      size="default"
                      src={user?.avatarUrl}
                      icon={!user?.avatarUrl && <UserOutlined />}
                      className="bg-blue-600 text-white"
                    />
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-gray-800 leading-tight">
                        {user?.name || 'User'}
                      </span>
                      <div className="mt-0.5">{getRoleTag()}</div>
                    </div>
                  </button>
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button type="text" className="font-medium text-gray-700">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button type="primary" className="bg-blue-600 hover:bg-blue-700 font-medium">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

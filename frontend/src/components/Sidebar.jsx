import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOutlined,
  DashboardOutlined,
  TrophyOutlined,
  UserOutlined,
  PlusCircleOutlined,
  FormOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

export const Sidebar = ({ onClose }) => {
  const { role } = useAuth();

  const getNavLinks = () => {
    if (role === ROLES.ADMIN) {
      return [
        { to: '/admin', label: 'Admin Dashboard', icon: <DashboardOutlined /> },
        { to: '/courses', label: 'All Courses', icon: <BookOutlined /> },
        { to: '/admin/users', label: 'Manage Users', icon: <TeamOutlined /> },
        { to: '/admin/categories', label: 'Categories', icon: <AppstoreOutlined /> },
        { to: '/profile', label: 'My Profile', icon: <UserOutlined /> },
      ];
    }
    if (role === ROLES.INSTRUCTOR) {
      return [
        { to: '/instructor', label: 'Instructor Hub', icon: <DashboardOutlined /> },
        { to: '/courses', label: 'Explore Catalogue', icon: <BookOutlined /> },
        { to: '/instructor/courses/new', label: 'Create New Course', icon: <PlusCircleOutlined /> },
        { to: '/profile', label: 'My Profile', icon: <UserOutlined /> },
      ];
    }
    // Learner (default)
    return [
      { to: '/learner', label: 'My Learning', icon: <DashboardOutlined /> },
      { to: '/courses', label: 'Browse Courses', icon: <BookOutlined /> },
      { to: '/learner/certificates', label: 'My Certificates', icon: <TrophyOutlined /> },
      { to: '/profile', label: 'My Profile', icon: <UserOutlined /> },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] flex flex-col p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-3">
        {role || 'Learner'} Navigation
      </div>
      <nav className="space-y-1">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/courses' || item.to === '/learner' || item.to === '/instructor' || item.to === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

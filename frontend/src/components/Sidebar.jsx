import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOutlined,
  DashboardOutlined,
  TrophyOutlined,
  UserOutlined,
  PlusCircleOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.INSTRUCTOR]: 'Instructor',
  [ROLES.LEARNER]: 'Learner',
};

const SECTION_LABELS = {
  [ROLES.ADMIN]: 'Admin navigation',
  [ROLES.INSTRUCTOR]: 'Instructor navigation',
  [ROLES.LEARNER]: 'Learner navigation',
};

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
    <aside className="flex w-full flex-col border-hairline bg-canvas lg:w-64 lg:shrink-0 lg:border-r lg:min-h-[calc(100vh-4rem)]">
      <div className="border-b border-hairline px-6 py-5">
        <p className="eyebrow">{SECTION_LABELS[role] || SECTION_LABELS[ROLES.LEARNER]}</p>
        <p className="mt-2 text-body-md-strong text-ink">{ROLE_LABELS[role] || ROLE_LABELS[ROLES.LEARNER]}</p>
      </div>

      <nav className="space-y-1 p-3" aria-label="Section">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/courses' || item.to === '/learner' || item.to === '/instructor' || item.to === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex min-h-[44px] items-center gap-3 rounded-sm px-3 py-2.5 text-body-md transition-colors ${
                isActive
                  ? 'bg-hairline font-medium text-ink'
                  : 'text-body hover:bg-hairline hover:text-ink'
              }`
            }
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

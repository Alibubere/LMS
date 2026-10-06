import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer } from 'antd';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';
import { Button } from 'antd';

const PUBLIC_LINKS = [
  { to: '/courses', label: 'Explore Courses' },
  { to: '/learner', label: 'Learner Dashboard' },
  { to: '/instructor', label: 'Instructor Hub' },
  { to: '/admin', label: 'Platform Command' },
];

export const AppShell = ({ children, showSidebar = true }) => {
  const { isAuthenticated } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();

  const shouldRenderSidebar = isAuthenticated && showSidebar;
  const closeDrawer = () => setMobileDrawerOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <Navbar onToggleMenu={() => setMobileDrawerOpen(true)} />

      {/* Mobile navigation drawer */}
      <Drawer
        placement="left"
        onClose={closeDrawer}
        open={mobileDrawerOpen}
        title={<span className="eyebrow m-0">Menu</span>}
        styles={{ body: { padding: 0 }, header: { borderBottom: '1px solid #ebebeb' } }}
        width={320}
        destroyOnClose
      >
        {shouldRenderSidebar ? (
          <Sidebar onClose={closeDrawer} />
        ) : (
          <div className="flex flex-col gap-6 p-6">
            <nav className="flex flex-col gap-1" aria-label="Primary">
              {PUBLIC_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeDrawer}
                  className={`flex min-h-[44px] items-center rounded-sm px-3 py-2.5 text-body-md transition-colors ${
                    location.pathname === link.to
                      ? 'bg-hairline font-medium text-ink'
                      : 'text-body hover:bg-hairline hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 border-t border-hairline pt-6">
              <Link to="/login" onClick={closeDrawer}>
                <Button type="default" block>
                  Sign in
                </Button>
              </Link>
              <Link to="/register" onClick={closeDrawer}>
                <Button type="primary" block>
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Drawer>

      {/* Main layout */}
      <div
        className={`mx-auto flex w-full max-w-app flex-1 ${
          shouldRenderSidebar ? 'has-sidebar' : ''
        }`}
      >
        {shouldRenderSidebar && (
          <div className="hidden shrink-0 lg:block">
            <Sidebar />
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AppShell;

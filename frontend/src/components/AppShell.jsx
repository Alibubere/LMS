import React, { useState } from 'react';
import { Drawer } from 'antd';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';

export const AppShell = ({ children, showSidebar = true }) => {
  const { isAuthenticated } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const shouldRenderSidebar = isAuthenticated && showSidebar;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onToggleSidebar={() => setMobileDrawerOpen(true)} />

      {/* Mobile Drawer */}
      {shouldRenderSidebar && (
        <Drawer
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          styles={{ body: { padding: 0 } }}
          width={280}
        >
          <Sidebar onClose={() => setMobileDrawerOpen(false)} />
        </Drawer>
      )}

      {/* Main layout container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {shouldRenderSidebar && (
          <div className="hidden lg:block shrink-0">
            <Sidebar />
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p>© 2026 Learning Management System. Built for learners, instructors, and administrators.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;

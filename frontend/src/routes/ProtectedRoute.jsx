import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Result, Button } from 'antd';
import { useAuth } from '../hooks/useAuth';
import LoadingState from '../components/common/LoadingState';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState tip="Authenticating..." fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <Result
          status="403"
          title="Access Restricted"
          subTitle={`Your account role (${role}) is not authorized to access this resource.`}
          extra={
            <Button
              type="primary"
              onClick={() => (window.location.href = '/')}
              className="bg-blue-600"
            >
              Return to Safety
            </Button>
          }
        />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

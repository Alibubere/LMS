import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
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
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="card w-full max-w-lg">
          <div className="card-pad-lg text-center">
            <p className="eyebrow">Error 403</p>
            <h1 className="mt-4 text-display-lg text-ink">Access Restricted</h1>
            <p className="mt-4 text-body-md text-body">
              Your account role ({role}) is not authorized to access this resource.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                type="primary"
                size="large"
                onClick={() => (window.location.href = '/')}
              >
                Return to Safety
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

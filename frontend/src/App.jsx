import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/AppShell';
import AppRoutes from './routes/AppRoutes';

export const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <AppShell>
            <AppRoutes />
          </AppShell>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;

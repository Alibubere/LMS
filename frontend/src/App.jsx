import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/AppShell';
import AppRoutes from './routes/AppRoutes';

const displayFamily =
  'Inter, Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// Ant Design tokens mapped from DESIGN.md — black primary CTA, 4 px radius,
// hairline borders, display-sans typography.
const theme = {
  token: {
    colorPrimary: '#000000',
    colorInfo: '#000000',
    colorSuccess: '#1a7f4b',
    colorWarning: '#a34e12',
    colorError: '#c02626',
    colorText: '#000000',
    colorTextSecondary: '#999999',
    colorTextDescription: '#999999',
    colorLink: '#000000',
    colorLinkHover: '#999999',
    colorBorder: '#ebebeb',
    colorBorderSecondary: '#ebebeb',
    colorSplit: '#ebebeb',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#ffffff',
    colorFillAlter: '#ebebeb',
    colorFillSecondary: '#f6f6f6',
    borderRadius: 4,
    borderRadiusLG: 4,
    borderRadiusSM: 4,
    borderRadiusXS: 4,
    fontFamily: displayFamily,
    fontSize: 16,
    controlHeight: 40,
    controlHeightSM: 32,
    controlHeightLG: 44,
    boxShadow: '0 4px 10px 0 rgba(1, 1, 32, 0.1)',
    boxShadowSecondary: '0 4px 10px 0 rgba(1, 1, 32, 0.1)',
    motionDurationMid: '0.15s',
  },
  components: {
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none',
      fontWeight: 500,
      defaultBg: '#ffffff',
      defaultBorderColor: '#ebebeb',
      primaryBg: '#000000',
      primaryColor: '#ffffff',
      primaryHoverBg: '#1f1f1f',
      primaryHoverBorderColor: '#1f1f1f',
    },
    Card: {
      headerBg: 'transparent',
      paddingLG: 24,
      headerFontSize: 22,
      headerFontSizeMB: 22,
    },
    Table: {
      headerBg: '#ebebeb',
      headerColor: '#999999',
      rowHoverBg: '#fafafa',
      borderColor: '#ebebeb',
      headerSplitColor: 'transparent',
      cellPaddingBlock: 12,
      cellPaddingInline: 16,
    },
    Tabs: {
      inkBarColor: '#000000',
      itemColor: '#999999',
      itemHoverColor: '#000000',
      itemActiveColor: '#000000',
      titleFontSize: 11,
      horizontalItemGutter: 24,
    },
    Modal: {
      contentBg: '#ffffff',
      headerBg: '#ffffff',
      titleFontSize: 22,
      titleLineHeight: 1.15,
    },
    Form: {
      labelColor: '#000000',
      labelFontSize: 14,
      labelRequiredMarkColor: '#000000',
      itemMarginBottom: 20,
    },
    Input: {
      activeShadow: '0 0 0 2px rgba(1, 1, 32, 0.08)',
      errorActiveShadow: '0 0 0 2px rgba(192, 38, 38, 0.12)',
      warningActiveShadow: '0 0 0 2px rgba(163, 78, 18, 0.12)',
      hoverBorderColor: '#000000',
      activeBorderColor: '#000000',
    },
    Select: {
      optionSelectedBg: '#ebebeb',
      optionSelectedColor: '#000000',
      activeBorderColor: '#000000',
      hoverBorderColor: '#000000',
    },
    Tag: {
      defaultBg: '#ebebeb',
      defaultColor: '#000000',
    },
    Spin: {
      colorPrimary: '#000000',
    },
    Progress: {
      defaultColor: '#000000',
      remainingColor: '#ebebeb',
    },
    Pagination: {
      itemActiveBg: '#000000',
    },
    Message: {
      contentBg: '#ffffff',
    },
    Alert: {
      defaultBg: '#ebebeb',
    },
  },
};

export const App = () => {
  return (
    <ConfigProvider theme={theme}>
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

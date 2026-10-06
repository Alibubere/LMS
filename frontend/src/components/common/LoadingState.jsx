import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const LoadingState = ({ tip = 'Loading content...', fullPage = false, size = 'large' }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 36 : 24 }} spin />;

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center" role="status" aria-live="polite">
      <Spin indicator={antIcon} />
      <p className="mt-4 text-sm font-medium text-gray-500">{tip}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingState;

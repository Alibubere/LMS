import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const LoadingState = ({ tip = 'Loading content...', fullPage = false, size = 'large' }) => {
  const antIcon = (
    <LoadingOutlined style={{ fontSize: size === 'large' ? 28 : 20, color: '#000000' }} spin />
  );

  const content = (
    <div
      className="flex flex-col items-center justify-center p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <Spin indicator={antIcon} />
      <p className="eyebrow mt-5">{tip}</p>
    </div>
  );

  if (fullPage) {
    return <div className="flex min-h-[50vh] items-center justify-center">{content}</div>;
  }

  return content;
};

export default LoadingState;

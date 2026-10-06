import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export const ErrorState = ({
  title = 'Something went wrong',
  subTitle = 'An error occurred while loading this data. Please try again.',
  onRetry,
  status = 'error',
}) => {
  return (
    <div
      className="card my-4"
      role="alert"
      data-status={status}
    >
      <div className="card-pad-lg text-center">
        <p className="eyebrow">Something broke</p>
        <h3 className="mt-4 text-display-md text-ink">{title}</h3>
        <p className="mt-3 text-body-md text-ink">{subTitle}</p>
        {onRetry && (
          <div className="mt-6 flex justify-center">
            <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;

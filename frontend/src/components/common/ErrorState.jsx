import React from 'react';
import { Result, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export const ErrorState = ({
  title = 'Something went wrong',
  subTitle = 'An error occurred while loading this data. Please try again.',
  onRetry,
  status = 'error',
}) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-red-100 my-4 text-center">
      <Result
        status={status}
        title={<span className="text-gray-800 text-lg font-semibold">{title}</span>}
        subTitle={<span className="text-gray-500 text-sm">{subTitle}</span>}
        extra={
          onRetry && (
            <Button
              type="primary"
              danger
              icon={<ReloadOutlined />}
              onClick={onRetry}
              className="mt-2"
            >
              Retry
            </Button>
          )
        }
      />
    </div>
  );
};

export default ErrorState;

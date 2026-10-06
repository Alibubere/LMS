import React from 'react';
import { Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

export const EmptyState = ({ description = 'No items found', actionText, onAction, image }) => {
  return (
    <div className="card">
      <div className="card-pad-lg flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-hairline text-body">
          {image || <InboxOutlined className="text-lg" />}
        </div>
        <p className="mt-5 text-body-md text-ink">{description}</p>
        {actionText && onAction && (
          <div className="mt-6">
            <Button type="primary" onClick={onAction}>
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

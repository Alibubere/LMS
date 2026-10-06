import React from 'react';
import { Empty, Button } from 'antd';

export const EmptyState = ({
  description = 'No items found',
  actionText,
  onAction,
  image = Empty.PRESENTED_IMAGE_SIMPLE,
}) => {
  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm text-center">
      <Empty image={image} description={<span className="text-gray-500 font-medium">{description}</span>}>
        {actionText && onAction && (
          <Button type="primary" onClick={onAction} className="mt-2">
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;

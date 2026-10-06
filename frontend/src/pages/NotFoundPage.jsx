import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/">
            <Button type="primary" className="bg-blue-600">
              Back Home
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFoundPage;

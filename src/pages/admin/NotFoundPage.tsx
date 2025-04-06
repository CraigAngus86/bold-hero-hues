
import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <p className="text-gray-600">
        The page you are looking for doesn't exist or has been moved.
      </p>
    </div>
  );
};

export default NotFoundPage;

import React, { FC } from 'react'

const LoadingSpinner: FC = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

export default LoadingSpinner
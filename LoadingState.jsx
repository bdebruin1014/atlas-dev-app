import React from 'react';

const LoadingState = ({ type = 'spinner', message = 'Loading...' }) => {
  if (type === 'skeleton') {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-emerald-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingState;

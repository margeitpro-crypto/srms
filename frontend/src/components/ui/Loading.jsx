import React from 'react';
import { cn } from '../../lib/utils';

export const Loading = ({ size = 'md', className = '', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div className={cn('animate-spin rounded-full border-2 border-blue-500 border-t-transparent', sizeClasses[size])}></div>
      {text && <span className="text-gray-600 text-sm">{text}</span>}
    </div>
  );
};

export const LoadingSpinner = ({ className = '' }) => (
  <div className={cn('animate-spin rounded-full border-2 border-blue-500 border-t-transparent w-6 h-6', className)}></div>
);

export const LoadingButton = ({ loading, children, disabled, ...props }) => (
  <button
    disabled={loading || disabled}
    className={cn(
      'inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:px-4 sm:py-2',
      props.className
    )}
    {...props}
  >
    {loading && <LoadingSpinner className="mr-1 sm:mr-2" />}
    {children}
  </button>
);

export default Loading;
import React from 'react';

const SidebarSkeleton = () => {
  return (
    <div className="w-80 h-full flex flex-col bg-gray-800 bg-opacity-50 border-r border-gray-700">
      {/* Header skeleton */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <div className="h-6 bg-gray-700 rounded w-28 animate-pulse"></div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
        </div>
      </div>
      
      {/* Search bar skeleton */}
      <div className="p-3 border-b border-gray-700">
        <div className="h-10 bg-gray-700 rounded-full animate-pulse"></div>
      </div>
      
      {/* Tabs skeleton */}
      <div className="flex border-b border-gray-700 px-2 py-1">
        <div className="flex-1 h-8 bg-gray-700 rounded mx-1 animate-pulse"></div>
        <div className="flex-1 h-8 bg-gray-700 rounded mx-1 animate-pulse"></div>
        <div className="flex-1 h-8 bg-gray-700 rounded mx-1 animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-700 rounded mx-1 animate-pulse"></div>
      </div>
      
      {/* Conversation list skeletons */}
      <div className="flex-1 overflow-y-auto">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex items-center p-3 border-b border-gray-700/30">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
              {/* Simulate online indicator for some items */}
              {index % 3 === 0 && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gray-600 border-2 border-gray-800 animate-pulse"></div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gray-700 rounded w-12 animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="h-3 bg-gray-700 rounded w-32 animate-pulse"></div>
                {/* Simulate unread indicator for some items */}
                {index % 2 === 0 && (
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarSkeleton;
import React from 'react'

const MessageSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-4 p-4">
      {/* Generate multiple message skeletons */}
      {Array(count).fill(0).map((_, index) => {
        // Alternate between received and sent messages
        const isSent = index % 2 === 0;
        // Vary the width of messages for more realistic appearance
        const widthClass = [
          "w-24", "w-32", "w-48", "w-40", "w-56", "w-36", 
          "w-44", "w-52", "w-28"
        ][index % 9];
        
        return (
          <div 
            key={index} 
            className={`flex items-end gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar - only for received messages */}
            {!isSent && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 animate-pulse"></div>
            )}
            
            {/* Message bubble */}
            <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
              <div 
                className={`${widthClass} h-9 rounded-2xl animate-pulse ${
                  isSent ? 'bg-blue-800/70 rounded-br-none' : 'bg-gray-700 rounded-bl-none'
                }`}
              ></div>
              
              {/* Time indicator */}
              <div className="h-3 w-12 mt-1 rounded animate-pulse bg-gray-700"></div>
            </div>
          </div>
        );
      })}
      
      {/* Typing indicator at the end */}
      <div className="flex items-end gap-2 mt-6">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 animate-pulse"></div>
        <div className="h-6 w-16 rounded-full bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  )
}

export default MessageSkeleton
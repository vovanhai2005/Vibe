import React, { useState, useEffect } from 'react';
import { useFriendStore } from '../store/useFriendStore';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { pendingFriendRequests } = useFriendStore();
  
  useEffect(() => {
    // Convert friend requests to notifications
    const friendRequestNotifications = pendingFriendRequests?.map(request => ({
      id: `friend-${request._id}`,
      type: 'follow',
      user: request.sender,
      timestamp: request.createdAt,
      read: false
    })) || [];
    
    // Sample notifications - in a real app, these would come from an API
    const sampleNotifications = [
      {
        id: 'sample-1',
        type: 'follow',
        user: {
          _id: 'user123',
          username: 'prwwwar',
          profilePic: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: false
      },
      {
        id: 'sample-2',
        type: 'follow',
        user: {
          _id: 'user456',
          username: '_vynniesheartfeltmoments_',
          profilePic: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        timestamp: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000), // 23 days ago
        read: true
      }
    ];
    
    setNotifications([...friendRequestNotifications, ...sampleNotifications]);
  }, [pendingFriendRequests]);
  
  // Format time display similar to Instagram
  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      // Format like "Sep 08"
      return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    }
  };
  
  // Group notifications by week and month (Instagram style)
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const thisWeekNotifications = notifications.filter(n => {
    const notifDate = new Date(n.timestamp);
    return notifDate > oneWeekAgo;
  });
  
  const thisMonthNotifications = notifications.filter(n => {
    const notifDate = new Date(n.timestamp);
    return notifDate <= oneWeekAgo;
  });
  
  return (
    <div className="w-full h-full flex flex-col bg-black text-white">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Notifications</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {thisWeekNotifications.length > 0 && (
          <div>
            <h3 className="px-4 py-2 text-sm font-medium text-gray-400">
              This week
            </h3>
            {thisWeekNotifications.map(notification => (
              <div 
                key={notification.id}
                className="px-4 py-3 border-b border-gray-800 hover:bg-gray-900 flex items-center"
              >
                <div className="mr-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={notification.user.profilePic || '/avatar.png'} 
                      alt={notification.user.username || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-bold">{notification.user.username}</span>
                  {' started following you. '}
                  <span className="text-gray-400 text-sm">{formatTimeAgo(notification.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {thisMonthNotifications.length > 0 && (
          <div>
            <h3 className="px-4 py-2 text-sm font-medium text-gray-400">
              This month
            </h3>
            {thisMonthNotifications.map(notification => (
              <div 
                key={notification.id}
                className="px-4 py-3 border-b border-gray-800 hover:bg-gray-900 flex items-center"
              >
                <div className="mr-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={notification.user.profilePic || '/avatar.png'} 
                      alt={notification.user.username || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-bold">{notification.user.username}</span>
                  {' started following you. '}
                  <span className="text-gray-400 text-sm">{formatTimeAgo(notification.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {notifications.length === 0 && (
          <div className="p-4 text-center text-gray-400">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
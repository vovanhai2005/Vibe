import React, { useEffect, useState } from 'react';
import { useFriendStore } from '../store/useFriendStore';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { Search, User, Bell, UserPlus, CheckCircle, X } from 'lucide-react';
import SidebarSkeleton from './skeletons/SidebarSkeleton';

const Sidebar = () => {
  const { friends, pendingRequests, getFriends, getPendingRequests, acceptFriendRequest, rejectFriendRequest, searchFriends, isLoading } = useFriendStore();
  const { setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    getFriends();
    getPendingRequests(); 
  }, [getFriends, getPendingRequests]);

  // Filter friends by search query
  const filteredFriends = searchFriends(searchQuery);

  // Handle selecting a user to chat with
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="bg-gray-900 w-72 h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white mb-4">Messages</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full p-2 pl-8 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Friend Requests */}
      {pendingRequests.length > 0 && (
        <div className="p-4 border-b border-gray-800">
          <button 
            className="flex items-center justify-between w-full text-left"
            onClick={() => setShowRequests(!showRequests)}
          >
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-white font-medium">Friend Requests</span>
            </div>
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          </button>
          
          {showRequests && (
            <div className="mt-3 space-y-3">
              {pendingRequests.map(request => (
                <div key={request._id} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 mr-2">
                      {request.requester.profilePicture ? (
                        <img
                          src={request.requester.profilePicture}
                          alt={request.requester.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <User className="text-gray-500" size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{request.requester.fullName || request.requester.username}</p>
                      <p className="text-gray-400 text-xs">@{request.requester.username}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => acceptFriendRequest(request._id)}
                      className="flex-1 bg-blue-600 text-white text-xs py-1 rounded flex items-center justify-center"
                    >
                      <CheckCircle size={12} className="mr-1" />
                      Accept
                    </button>
                    <button 
                      onClick={() => rejectFriendRequest(request._id)}
                      className="flex-1 bg-gray-700 text-gray-300 text-xs py-1 rounded flex items-center justify-center"
                    >
                      <X size={12} className="mr-1" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Friend List */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Friends</h2>
        {filteredFriends.length > 0 ? (
          filteredFriends.map(friend => (
            <div
              key={friend._id}
              onClick={() => handleSelectUser(friend)}
              className="px-4 py-3 flex items-center hover:bg-gray-800 cursor-pointer"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                  {friend.profilePicture ? (
                    <img 
                      src={friend.profilePicture} 
                      alt={friend.username} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User className="text-gray-500" size={20} />
                    </div>
                  )}
                </div>
                {onlineUsers.includes(friend._id) && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{friend.fullName || friend.username}</p>
                <p className="text-gray-400 text-sm">{onlineUsers.includes(friend._id) ? "Online" : "Offline"}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? (
              `No friends found matching "${searchQuery}"`
            ) : (
              <>
                <p className="mb-2">No friends yet</p>
                <a href="/search" className="text-blue-400 hover:underline flex items-center justify-center">
                  <UserPlus size={14} className="mr-1" />
                  Find Friends
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
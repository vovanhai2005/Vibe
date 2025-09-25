import React, { useState, useEffect, useRef } from 'react';
import { User, Search, X, Loader, Users, UserPlus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useFriendStore } from '../store/useFriendStore';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [sentRequests, setSentRequests] = useState({});
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { users, getUsers, isUsersLoading } = useChatStore();
  const { sendFriendRequest, getFriends, friends } = useFriendStore();
  const searchInputRef = useRef(null);

  // Load all users and friends when component mounts
  useEffect(() => {
    getUsers();
    getFriends();
    
    // Focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [getUsers, getFriends]);

  // Create a set of friend IDs for efficient lookup
  const friendIds = new Set(friends.map(friend => friend._id));

  // Filter users based on search query AND exclude friends
  const filteredResults = users.filter(user => {
    // Exclude current user
    if (user._id === authUser?._id) return false;
    
    // Exclude users who are already friends
    if (friendIds.has(user._id)) return false;
    
    // Filter by search query
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) || 
      (user.fullName && user.fullName.toLowerCase().includes(query))
    );
  });

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleAddFriendRequest = async (userId) => {
    try {
      // Show loading state immediately
      setSentRequests(prev => ({ ...prev, [userId]: 'pending' }));
      
      // Send the friend request
      const success = await sendFriendRequest(userId);
      
      // Update the state based on the result
      if (success) {
        setSentRequests(prev => ({ ...prev, [userId]: 'sent' }));
      } else {
        // Reset if there was an error
        setSentRequests(prev => ({ ...prev, [userId]: null }));
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
      setSentRequests(prev => ({ ...prev, [userId]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-[#171C2E]">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            <Users className="inline-block mr-3 text-blue-600" />
            Discover People
          </h1>
          <p className="text-white max-w-2xl mx-auto">
            Connect with users from around the world. Search by username or name to find your next conversation.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border-2 border-blue-500">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-6 h-6 text-blue-500" />
            </div>
            
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find your next connection..."
              className="w-full p-5 pl-14 text-lg bg-white text-gray-800 focus:outline-none"
            />
            
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isUsersLoading && (
          <div className="flex flex-col justify-center items-center my-16">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <p className="mt-4 text-white font-medium">Finding amazing people...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-white p-6 rounded-lg my-6 shadow-md animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!isUsersLoading && filteredResults.length > 0 && (
          <div className="mt-6 pl-4">
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-semibold text-white text-left">
                {searchQuery ? `Found ${filteredResults.length} results for "${searchQuery}"` : "People you might want to connect with"}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-start">
              {filteredResults.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                  <div className="px-5 pb-5 pt-0 relative">
                    <div className="absolute -top-24 left-5">
                      <div className="h-20 w-20 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800 shadow-md">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.username} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-800">
                            <User className="text-white" size={32} />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-12">
                      <h3 className="font-bold text-xl text-white">{user.fullName || user.username}</h3>
                      <p className="text-blue-500">@{user.username}</p>
                      
                      <div className="flex mt-4 space-x-2">
                        {/* Fixed Request Sent button to stay on one line */}
                        {sentRequests[user._id] === 'sent' ? (
                          <button 
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center cursor-default whitespace-nowrap"
                          >
                            <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">Request Sent</span>
                          </button>
                        ) : sentRequests[user._id] === 'pending' ? (
                          <button 
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center opacity-75 whitespace-nowrap"
                            disabled
                          >
                            <Loader className="w-4 h-4 mr-1 animate-spin flex-shrink-0" />
                            <span className="truncate">Sending...</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAddFriendRequest(user._id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center whitespace-nowrap"
                          >
                            <UserPlus className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">Add Friend</span>
                          </button>
                        )}
                        <button 
                          onClick={() => handleUserClick(user._id)}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center whitespace-nowrap"
                        >
                          <User className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Profile</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isUsersLoading && filteredResults.length === 0 && (
          <div className="bg-gray-900 rounded-xl shadow-lg p-10 text-left max-w-xl ml-4">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <User className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchQuery ? "No matching users found" : "No new people to connect with"}
            </h3>
            <p className="text-white mb-6">
              {searchQuery 
                ? "We couldn't find any users matching your search criteria." 
                : "You've already connected with everyone on the platform!"}
            </p>
            <div className="flex flex-col space-y-3">
              <p className="text-sm text-white">Try:</p>
              <ul className="text-left text-white">
                <li className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
                  Checking the spelling of the username
                </li>
                <li className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
                  Using different keywords
                </li>
                <li className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
                  Inviting new users to join
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
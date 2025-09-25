import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { Search, MoreHorizontal, Settings, User, MessageSquare } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search and active tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread") return matchesSearch && user.hasUnreadMessages;
    if (activeTab === "groups") return matchesSearch && user.isGroup;
    
    return matchesSearch;
  });

  useEffect(() => {
    try {
      getUsers();
    } catch (error) {
      console.error("Error in getUsers():", error);
      toast.error("Could not load conversations");
    }
  }, [getUsers]);

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="w-80 flex-shrink-0 h-full bg-gray-800 bg-opacity-50 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Đoạn chat</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-700 text-gray-300">
            <MoreHorizontal size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700 text-gray-300">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            className="w-full pl-10 pr-4 py-2 bg-gray-700 text-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "all" 
              ? "text-blue-500 border-b-2 border-blue-500" 
              : "text-gray-400 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "unread" 
              ? "text-blue-500 border-b-2 border-blue-500" 
              : "text-gray-400 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("unread")}
        >
          Chưa đọc
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "groups" 
              ? "text-blue-500 border-b-2 border-blue-500" 
              : "text-gray-400 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("groups")}
        >
          Nhóm
        </button>
        <button className="px-3 py-2 text-gray-400 hover:bg-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isSelected = selectedUser && selectedUser._id === user._id;
            
            return (
              <div
                key={user._id}
                className={`flex items-center p-3 cursor-pointer ${
                  isSelected ? "bg-gray-700" : "hover:bg-gray-700/50"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                {/* Avatar with online indicator */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.username} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
                  )}
                </div>
                
                {/* Chat info */}
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-white font-medium truncate">{user.fullName || user.username}</h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{user.lastMessageTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400 truncate">
                      {user.lastMessage}
                    </p>
                    {user.hasUnreadMessages && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 ml-2"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 px-4">
            <MessageSquare className="text-gray-500 mb-3" size={40} />
            <p className="text-center">No conversations found</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-sm text-white rounded-md hover:bg-blue-700 transition">
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
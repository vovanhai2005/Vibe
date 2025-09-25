import React from 'react';
import { MessageSquare, Users, PlusCircle, Share2, Search } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const NoChatSelected = () => {
  const { authUser } = useAuthStore();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Vibe icon/logo with subtle animation */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
          <MessageSquare size={48} className="text-white" />
        </div>
        
        {/* App name */}
        <h1 className="text-3xl font-bold text-white mb-2">Vibe</h1>
        
        {/* Personalized greeting */}
        <p className="text-gray-300 text-lg mb-6">
          Hey {authUser?.fullName?.split(' ')[0] || authUser?.username || 'there'}, ready to connect?
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle size={18} className="mr-2" />
            New Message
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors">
            <Users size={18} className="mr-2" />
            Create Group
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors">
            <Search size={18} className="mr-2" />
            Find Friends
          </button>
        </div>
        
        {/* Helper text */}
        <p className="text-gray-400 text-sm">
          Select a conversation from the sidebar or start a new one
        </p>
        
        {/* Decorative elements */}
        <div className="mt-12 flex items-center gap-2 text-gray-500 text-xs">
          <Share2 size={14} />
          <span>Invite friends to join Vibe</span>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-[120px] opacity-10 -z-10"></div>
      <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-blue-500 rounded-full filter blur-[120px] opacity-10 -z-10"></div>
    </div>
  );
};

export default NoChatSelected;
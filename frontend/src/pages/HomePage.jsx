import React from 'react';
import { useChatStore } from '../store/useChatStore';
import Sidebar from '../components/Sidebar';
import ChatSelected from '../components/ChatSelected';
import NoChatSelected from '../components/NoChatSelected';
import Navbar from '../components/Navbar';
import { useState } from 'react';

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { showNotifications, setShowNotifications } = useState(false);
  
  return (
    <div className="h-screen w-[calc(100%-5rem)] flex overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        {selectedUser ? <ChatSelected /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default HomePage;
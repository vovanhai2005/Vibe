import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { User, Phone, Video, Info, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const ChatHeader = () => {
    const { onlineUsers } = useAuthStore();
    const { selectedUser, setSelectedUser } = useChatStore();

    return (
        <div className="bg-gray-900 py-3 px-4 flex items-center border-b border-gray-800">
            {/* Back button (for mobile) */}
            <button 
                className="md:hidden mr-2 text-gray-400 hover:text-white"
                onClick={() => setSelectedUser(null)}
            >
                <ChevronLeft size={20} />
            </button>

            {/* User Avatar */}
            <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                    {selectedUser?.profilePicture ? (
                        <img 
                            src={selectedUser.profilePicture} 
                            alt={selectedUser.username} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User className="text-gray-400" size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* User Info */}
            <div className="ml-3 flex-1">
                <h3 className="font-medium text-white">
                    {selectedUser?.fullName || selectedUser?.username || "Unknown User"}
                </h3>
                <p className="text-xs text-gray-400 flex items-center">
                    {onlineUsers.includes(selectedUser._id) ? (
                        <>
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            Đang hoạt động
                        </>
                    ) : (
                        "Offline"
                    )}
                </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3">
                <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800">
                    <Phone size={20} />
                </button>
                <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800">
                    <Video size={20} />
                </button>
                <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800">
                    <Info size={20} />
                </button>
            </div>
        </div>
    )
}

export default ChatHeader
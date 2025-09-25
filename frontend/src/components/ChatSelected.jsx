import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { formatMessageTime } from "../lib/utils";

const ChatSelected = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToNewMessages, unSubscribeToNewMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            subscribeToNewMessages();

            return () => unSubscribeToNewMessages();
        }
    }, [selectedUser, getMessages, subscribeToNewMessages, unSubscribeToNewMessages]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex flex-col h-full w-full">
                <ChatHeader />
                <div className="flex-1 overflow-y-auto">
                    <MessageSkeleton />
                </div>
                <MessageInput />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header fixed at top */}
            <ChatHeader />
            
            {/* Messages area - scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                <div
                    key={message._id}
                    className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                >
                    <div className="chat-image avatar">
                        <div className="size-10 rounded-full border">
                            <img
                                src={
                                    message.senderId === authUser._id
                                    ? (authUser.profilePicture || authUser.profilePic || authUser.avatar || "/avatar.png")
                                    : (selectedUser.profilePicture || selectedUser.profilePic || selectedUser.avatar || "/avatar.png")
                                }
                                alt="profile pic"
                            />
                        </div>
                    </div>

                    <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 ml-1">
                        {formatMessageTime ? formatMessageTime(message.createdAt) : ""}
                    </time>
                    </div>
                        <div className="chat-bubble flex flex-col">
                        {message.image && (
                            <img
                            src={message.image}
                            alt="Attachment"
                            className="sm:max-w-[200px] rounded-md mb-2"
                            />
                        )}
                        {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
                {/* This is the element we'll scroll to */}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Input fixed at bottom */}
            <MessageInput />
        </div>
    );
};

export default ChatSelected;
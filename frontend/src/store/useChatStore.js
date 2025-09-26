import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false, // Add sending message state

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  
  getMessages: async (userId) => {
    if (!userId) return;
    
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      
      // Deduplicate messages by ID
      const uniqueMessages = Array.from(
        new Map(response.data.map(msg => [msg._id, msg])).values()
      );
      
      set({ messages: uniqueMessages });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;  

    // Add a loading state to prevent duplicate calls
    if (get().isSendingMessage) return;
    set({ isSendingMessage: true });

    try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);
        set({ messages: [...messages, res.data] });
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to send message");
        throw error;
    } finally {
        set({ isSendingMessage: false });
    }
  },

  subscribeToNewMessages: () => {
    const { selectedUser} = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage ] });
    });

  },
  
  unSubscribeToNewMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

}));
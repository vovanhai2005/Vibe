import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useFriendStore = create((set, get) => ({
    friends: [],
    pendingRequests: [],
    isLoading: false,
    error: null,

    // Fixed send friend request function
    sendFriendRequest: async (userId) => {
        try {
            // Add empty object as second parameter to ensure proper request format
            const response = await axiosInstance.post(`/friends/request/${userId}`, {});
            
            toast.success(response.data?.message || "Friend request sent successfully");
            return true;
        } catch (error) {
            console.error("Friend request error:", error);
            
            // The backend uses 'message' instead of 'error' field
            const errorMessage = error.response?.data?.message || "Failed to send friend request";
            
            // Check for specific errors that should show success messages
            if (errorMessage.includes("already sent") || 
                errorMessage.includes("already friends")) {
                toast.success(errorMessage);
                return true; // Still show success in UI
            } else {
                toast.error(errorMessage);
                return false;
            }
        }
    },

    // Get friend list
    getFriends: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/friends");
            set({ friends: response.data, isLoading: false });
        } catch (error) {
        console.error("Get friends error:", error);
        set({ 
            error: error.response?.data?.error || "Failed to load friends", 
            isLoading: false 
        });
        }
    },

    // Get pending friend requests
    getPendingRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/friends/pending");
            set({ pendingRequests: response.data, isLoading: false });
        } catch (error) {
            console.error("Get pending requests error:", error);
        set({
            error: error.response?.data?.error || "Failed to load pending requests",
            isLoading: false
        });
        }
    },

    acceptFriendRequest: async (requestId) => {
        try {
            await axiosInstance.post(`/friends/accept/${requestId}`);
            // Update local state
            set((state) => ({
                pendingRequests: state.pendingRequests.filter(req => req._id !== requestId)
            }));
            // Refresh friends list
            get().getFriends();
            toast.success("Friend request accepted");
        } catch (error) {
            console.error("Accept friend request error:", error);
            toast.error(error.response?.data?.error || "Failed to accept friend request");
        }
    },

    rejectFriendRequest: async (requestId) => {
        try {
            await axiosInstance.post(`/friends/reject/${requestId}`);
            // Update local state
            set((state) => ({
                pendingRequests: state.pendingRequests.filter(req => req._id !== requestId)
            }));
            toast.success("Friend request rejected");
        } catch (error) {
            console.error("Reject friend request error:", error);
            toast.error(error.response?.data?.error || "Failed to reject friend request");
        }
    },

    searchFriends: (query) => {
        const { friends } = get();
        if (!query) return friends;
        return friends.filter(friend => 
            friend.username.toLowerCase().includes(query.toLowerCase())
        );
    },
}));
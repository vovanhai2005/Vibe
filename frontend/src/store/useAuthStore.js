import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = "http://localhost:8000";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/api/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            if (error.response && error.response.status === 401) {
                set({ authUser: null });
            } else if (!error.message.includes('Network Error')) {
                console.error("Auth check failed:", error);
                set({ authUser: null });
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/api/auth/signup", data);
            if (res && res.data) {
                set({ authUser: res.data });
                toast.success("Account created successfully");
                get().connectSocket();  

                window.location.href = '/';
            }
        } catch (error) {
            console.error("Signup error:", error);
            const errorMessage = error.response?.data?.message || 
                               "Network error. Please check if the server is running.";
            toast.error(errorMessage);
            set({ authUser: null });
        } finally {
            set({ isSigningUp: false });
        }
    },  

    login: async (data) => {
        set ({isLoggingIn: true})
        try {
            const res = await axiosInstance.post("/api/auth/login", data);
            if (res && res.data) {
                set({ authUser: res.data });
                toast.success("Logged in successfully");
                get().connectSocket();

                window.location.href = '/';
            }
        } catch (error) {
            console.error("Login error:", error);
            
            if (error.response) {
                // Detailed error handling
                if (error.response.status === 400) {
                    toast.error(error.response.data.message || "Invalid login information");
                } else if (error.response.status === 401) {
                    toast.error("Invalid credentials");
                } else {
                    toast.error(error.response.data.message || "Login failed");
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }
            
            set({ authUser: null });
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/api/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();

            window.location.href = '/login';
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to log out");
        } finally {
            set({ isSigningUp: false, isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/api/auth/update-profile", data);
            if (res && res.data) {
                set({ authUser: res.data });
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            const errorMessage = error.response?.data?.message || 
                               "Network error at updateProfile. Please check if the server is running.";
            toast.error(errorMessage);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
        query: {
            userId: authUser._id,
        },
        });
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}));
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.jsx";
import { toast } from "react-hot-toast";
import { data } from "react-router-dom";
import { io } from "socket.io-client";


const BASE_URL =  "https://chat-app-backend-production-023c.up.railway.app/api";

export const useAuthStore = create((set , get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket:null,
    
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async(data) => {
    set({isSigningUp : true});

    try {
        
     const res = await axiosInstance.post("/auth/signup" , data);
     set({authUser: res.data});
     
     get().connectSocket();
     toast.success("Account created successfully");

    } catch (error) {
        toast.error(error.response.data.message);
    }finally{
        set({isSigningUp: false});
    }

    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
    
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

    logout:async(data) =>{
     try {
        await axiosInstance.post("/auth/logout");
        set({authUser : null});
        get().disconnectSocket();
        toast.success("Logout successfully");
        
     } catch (error) {
        toast.error(error.response.data.message);
     }

    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
      
      connectSocket: () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        });
         socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (userIds) => {
           console.log("This is the online users", userIds);
            set({ onlineUsers: userIds });
        });
      }, 
      
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },


}));

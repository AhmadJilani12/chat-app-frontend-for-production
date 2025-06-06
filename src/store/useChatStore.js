import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set , get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ isUsersLoading: false });
        }
    },
   
    getMessages: async(userId)=>{
        set({isMessagesLoading : true});

        try {
            console.log("This is the userId", userId);
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log("This is the messages", res.data);
           set({messages : res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading : false})
        }
    },
    setSelectedUser: (user) => set({ selectedUser: user }),
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
    
        socket.on("newMessage", (newMessage) => {
            console.log("This is the new message", newMessage);
          const isMessageSentFromSelectedUser = newMessage.SenderId === selectedUser._id;
          if (!isMessageSentFromSelectedUser) return;
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
        });
      },
      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
      },

}));
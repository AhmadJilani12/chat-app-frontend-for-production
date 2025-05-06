import axios  from "axios";

export const axiosInstance = axios.create({
    baseURL:  "https://chat-app-backend-production-f9fc.up.railway.app/api" ,
    withCredentials: true,
  });


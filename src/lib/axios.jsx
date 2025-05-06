import axios  from "axios";

export const axiosInstance = axios.create({
    baseURL:  "https://chat-app-backend-production-023c.up.railway.app/api" ,
    withCredentials: true,
  });


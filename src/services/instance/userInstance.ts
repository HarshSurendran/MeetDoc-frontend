import axios from "axios";


export const userAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

//Request Interceptor
userAxiosInstance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("userAccessToken");
    console.log("This is from acios interceptors: ", config)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  });



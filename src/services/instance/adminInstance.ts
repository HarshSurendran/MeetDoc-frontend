import axios from "axios";


export const adminAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

adminAxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminAccessToken");
    console.log("This is from admin axios interceptors: ", config)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
import { resetAdmin } from "@/redux/slices/adminSlice";
import appStore from "@/redux/store/appStore";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL


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


adminAxiosInstance.interceptors.response.use((response) => {
    return response
  }, async (error) => {
    const originalRequest = error.config;
  
    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        console.log("Entered 401 unauthorised response middleware, trying to create new token for doctors")
        originalRequest._retry = true;
        try {
          const newAccessToken = await getNewAccessToken();
          localStorage.setItem("adminAccessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return adminAxiosInstance(originalRequest);
        } catch (err) {
          toast.error("Session expired");
          appStore.dispatch(resetAdmin())
          return Promise.reject(err);
        }
      }
  
      if (error.response.status == 403) {
        appStore.dispatch(resetAdmin())
        toast.error("Your account is blocked by the site")
      }
  
      if (error.response.status >= 500) {
        toast.error(error.response.data.message || 'something went wrong');  
      }
  
      if (error.response.status >= 400 && error.response.status < 500 && error.response.status !== 401) {
        console.log("reached admin axios interceptor toast statement for user errors")
        toast.error(`${error.response.data.message || 'An error occurred'}`);
      }
    } else if (error.request) {
      toast.error("Network error, please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }
  });
  
  async function getNewAccessToken() {
    const response = await axios.get(`${BASE_URL}/auth/doctor/refreshtoken`, {
      withCredentials: true,
    });
    console.log("THis is response from refreshtoken endpoint", response.data);
    return response.data.accessToken;
  }
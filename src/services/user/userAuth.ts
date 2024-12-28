import axios, { Axios, AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { userAxiosInstance } from "../instance/userInstance";
import { Ilogin, IloginResponse } from "../../interfaces/user/Ilogin";
import apiErrorHandler from "../../utils/apiErrorHandler";
import { IUser } from "../../interfaces/user/IUser";
import { FormData } from "../../Pages/user/SignupPage";

// export const login = async (credentials: ILoginCredential) => {
//     try {
//         const res = await userAxiosInstance.post("/auth/login", credentials);
//         console.log("This is the response",res);
//         return res;
//     } catch (error) {
//         console.log("error", error);
//         if (error instanceof (AxiosError)) {
//             return error.message
//         }
//     }
// }

export const login = async (
  userCredentials: Ilogin
): Promise<AxiosResponse<IloginResponse> | undefined> => {
  try {
    const response = await userAxiosInstance.post(
      "/auth/login",
      userCredentials
    );
    console.log("This is response from login",response)
    return response;
  } catch (error) {
    console.log("This is error from login",error)

    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const logout = async (
  userId: string
): Promise<AxiosResponse | undefined> => {
  try {
    const response = await userAxiosInstance.post("/auth/logout", userId);
    return response;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const register = async (data: FormData) : Promise<AxiosResponse | undefined> => {
 try {
   const response = await userAxiosInstance.post("/auth/register", data);
   return response;
 } catch (error) {
   apiErrorHandler(error);
   return Promise.reject();
 }
}

export const verifyOtp = async (otp: string, data: {}) : Promise<AxiosResponse | undefined> => {
  try {
    const response = await userAxiosInstance.post("/auth/verify_otp", { otp, data});
    return response;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();    
  }
}

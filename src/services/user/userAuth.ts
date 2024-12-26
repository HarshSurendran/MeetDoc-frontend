import axios, { Axios, AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { userAxiosInstance } from "../instance/userInstance";
import { Ilogin, IloginResponse } from "../../interfaces/user/Ilogin";
import apiErrorHandler from "../../utils/apiErrorHandler";

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
    return response;
  } catch (error) {
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

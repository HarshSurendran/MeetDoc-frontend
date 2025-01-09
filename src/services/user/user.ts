import apiErrorHandler from "@/utils/apiErrorHandler";
import { userAxiosInstance } from "../instance/userInstance";
import { User } from "@/types/Authtypes/userTypes";

export const getUserData = async (id: string) => {
    try {
        const response = await userAxiosInstance.get(`users/${id}`);
        if (response) {
            return response.data;        
        }
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}

export const updateUser = async (id: string, data: User) => {
    try {
        const response = await userAxiosInstance.patch(`users/${id}`, data);
        if (response) {
            return response.data;
        }
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}
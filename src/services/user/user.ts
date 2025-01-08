import apiErrorHandler from "@/utils/apiErrorHandler";
import { userAxiosInstance } from "../instance/userInstance";

export const getUserData = async (id: string) => {
    try {
        const response = await userAxiosInstance.get(`user/${id}`);
        if (response) {
            return response.data;        
        }
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}
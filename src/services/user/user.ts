import apiErrorHandler from "@/utils/apiErrorHandler";
import { userAxiosInstance } from "../instance/userInstance";
import { User } from "@/types/Authtypes/userTypes";
import { IUser } from "@/interfaces/user/IUser";

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

export const updateUser = async (id: string, data: Partial<IUser>) => {
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

export const changeProfilePhoto = async (id: string, formData: FormData) => {
    try {
        const response = await userAxiosInstance.patch(`users/profilephoto/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response) {
            return response.data;
        }      
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();        
    }
}


export const getProfilePhoto = async (key : string) => {
    try {        
        const response = await userAxiosInstance.get(`/s3/file/${key}`);
        if (response) {
            return response.data.data.url;
        }
        return null;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}

export const fetchSingleDoctor = async (doctorId: string) => {
    try {
        const response = await userAxiosInstance.get(`users/doctordetails/${doctorId}`);
        if (response) {
            return response.data;
        }
        return null;
    } catch (error) {
        apiErrorHandler(error);
    }
}

export const getSlotsForDoctor = async (doctorId: string) => {
    try {
        const response = await userAxiosInstance.get(`users/doctorslots/${doctorId}`);
        if (response) {
            return response.data
        }
        return null;        
    } catch (error) {
        apiErrorHandler(error);
    }
}
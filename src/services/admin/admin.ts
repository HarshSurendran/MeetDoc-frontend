import { IUser } from "@/interfaces/user/IUser";
import apiErrorHandler from "../../utils/apiErrorHandler";
import { adminAxiosInstance } from "../instance/adminInstance"
import { Console } from "console";



export const getUsers = async () => {
  try {
    const response = await adminAxiosInstance.get('/admin/users');
    return response.data.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const toggleBlock = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/users/toggleblock/${id}`);
        return response.data;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}

export const editUser = async (id: string, body: IUser) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/users/${id}`, body);
        return response.data;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();        
    }
}

export const getUser = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/users/${id}`);
        return response.data;        
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}

export const addUser = async (data: IUser) => {
    try {
        const response = await adminAxiosInstance.post('/admin/users', data);
        console.log("Response from addUser", response);
        return response.data;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}

export const getVerificationRequests = async () => {
    try {
        const response = await adminAxiosInstance.get('/admin/verification-requests');
        return response.data;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}

export const verifyDoctor = async (id: string, payload : { isVerified: Boolean, degree: string, specialisation: string, masterDegree: string }) => {
    try {
        const response = await adminAxiosInstance.patch(`/auth/doctor/verify/${id}`, payload);
        return response.data;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}

export const getCertificate = async (key : string) => {
    try {        
        const response = await adminAxiosInstance.get(`/s3/file/${key}`);
        if (response) {
            return response.data.data.url;
        }
        return null;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}
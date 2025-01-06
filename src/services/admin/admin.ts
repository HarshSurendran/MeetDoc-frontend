import { IUser } from "@/interfaces/user/IUser";
import apiErrorHandler from "../../utils/apiErrorHandler";
import { adminAxiosInstance } from "../instance/adminInstance"



export const getUsers = async () => {
  try {
    const response = await adminAxiosInstance.get('/admin/users');

    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const toggleBlock = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/users/toggleblock/${id}`);
        return response;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}

export const editUser = async (id: string, body: IUser) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/users/${id}`, body);
        return response;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();        
    }
}

export const getUser = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/users/${id}`);
        return response;        
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}

export const addUser = async (data: IUser) => {
    try {
        const response = await adminAxiosInstance.post('/admin/users', data);
        console.log("Response from addUser", response);
        return response;
    } catch (error) {
        apiErrorHandler(error);
        return Promise.reject();
    }
}
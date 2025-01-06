import axios, { Axios, AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { IloginResponse } from '../../interfaces/admin/ILoginResponse';
import { Ilogin } from '../../interfaces/user/Ilogin';
import { adminAxiosInstance } from '../instance/adminInstance';
import apiErrorHandler from '../../utils/apiErrorHandler';

export const login = async (
  adminCredentials: Ilogin
): Promise<AxiosResponse<IloginResponse> | undefined> => {
  try {
    const response = await adminAxiosInstance.post(
      '/auth/admin/login',
      adminCredentials
    );
    return response;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const logout = async (
  adminId: string
): Promise<AxiosResponse | undefined> => {
  try {
    const response = await adminAxiosInstance.post(
      '/auth/admin/logout',
      adminId
    );
    localStorage.setItem('adminAccessToken', '');
    return response;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

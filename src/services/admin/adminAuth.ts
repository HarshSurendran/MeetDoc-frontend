import {  AxiosResponse } from 'axios';
import { IloginResponse } from '../../types/IAdmin';
import { Ilogin } from '../../types/';
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
    if (response) {
      return response.data;
    }
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
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

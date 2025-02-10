import { IUser } from '@/types/IUser';
import apiErrorHandler from '../../utils/apiErrorHandler';
import { adminAxiosInstance } from '../instance/adminInstance';
import { ICreateSubscriptionScheme } from '@/types';

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
    const response = await adminAxiosInstance.patch(
      `/admin/users/toggleblock/${id}`
    );
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const editUser = async (id: string, body: IUser) => {
  try {
    const response = await adminAxiosInstance.patch(`/admin/users/${id}`, body);
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await adminAxiosInstance.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const addUser = async (data: IUser) => {
  try {
    const response = await adminAxiosInstance.post('/admin/users', data);
    console.log('Response from addUser', response);
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const getVerificationRequests = async () => {
  try {
    const response = await adminAxiosInstance.get(
      '/admin/verification-requests'
    );
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const verifyDoctor = async (
  id: string,
  payload: {
    languages: string[];
    isVerified: Boolean;
    degree: string;
    specialisation: string;
    masterDegree: string;
  }
) => {
  try {
    const response = await adminAxiosInstance.patch(
      `/auth/doctor/verify/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const getCertificate = async (key: string) => {
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
};

export const getMonthlyData = async () => {
  try {
    const response = await adminAxiosInstance.get('/admin/monthly-data');
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const getRevenueData = async () => {
  try {
    const response = await adminAxiosInstance.get('/admin/revenue-data');
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const totalData = async () => {
  try {
    const response = await adminAxiosInstance.get('/admin/total-data');
    if(response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const addSubscriptionScheme = async (schema:ICreateSubscriptionScheme) => {
  try {
    const response = await adminAxiosInstance.post(
      '/admin/subscription', schema
    )
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const deleteSubscriptionScheme = async (id: string) => {
  try {
    const response = await adminAxiosInstance.delete(
      `/admin/subscription/${id}`
    )
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getSubscriptions = async () => {
  try {
    const respone = await adminAxiosInstance.get('/admin/subscription');
    if (respone) {
      return respone.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getDisabledSubscriptions = async () => {
  try {
    const response = await adminAxiosInstance.get('/admin/subscription/disabled');
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}
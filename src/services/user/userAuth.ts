import { AxiosResponse } from 'axios';
import { userAxiosInstance } from '../instance/userInstance';
import { Ilogin, IUserloginResponse, IUserSignUp } from '../../types/';
import apiErrorHandler from '../../utils/apiErrorHandler';
import { CredentialResponse } from '@react-oauth/google';

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
): Promise<AxiosResponse<Partial<IUserloginResponse>> | undefined> => {
  try {
    const response = await userAxiosInstance.post(
      '/auth/login',
      userCredentials
    );
    console.log('This is response from login', response);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.log('This is error from login', error);
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const logout = async (
  userId: string
): Promise<AxiosResponse | undefined> => {
  try {
    const response = await userAxiosInstance.post('/auth/logout', userId);
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const register = async (
  data: IUserSignUp
): Promise<AxiosResponse | undefined> => {
  try {
    const response = await userAxiosInstance.post('/auth/register', data);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const verifyOtp = async (
  otp: string,
  data: {}
): Promise<AxiosResponse | undefined> => {
  try {
    const response = await userAxiosInstance.post('/auth/verify_otp', {
      otp,
      data,
    });
    if (response) {
      return response;
    }
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const resendOtp = async (data: {}) => {
  try {
    const response = await userAxiosInstance.post('/auth/resend_otp', data);
    if (response) {
      return response.data;
    }    
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
}

export const sendGoogleToken = async (
  token: CredentialResponse
): Promise<AxiosResponse | undefined> => {
  try {
    const response = await userAxiosInstance.post('/auth/google/callback', {
      token,
    });
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
    return Promise.reject();
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await userAxiosInstance.post(
      '/auth/forgot-password', {
      email
    }
    )
    if(response){
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await userAxiosInstance.post(
      '/auth/reset-password', {
      resetToken: token,
      password: newPassword
    }
    )
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

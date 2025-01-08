import { FormData } from '../../components/doctor/steps/types';
import apiErrorHandler from '../../utils/apiErrorHandler';
import { doctorAxiosInstance } from '../instance/doctorInstance';

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await doctorAxiosInstance.post('/auth/doctor/login', data);
    
    if (response) {
      return response.data;      
    }
  } catch (error) {
    console.log('Entered catch statement-----------------------', error);
    apiErrorHandler(error);
  }
};

export const register = async (data: {}) => {
  try {
    const response = await doctorAxiosInstance.post(
      '/auth/doctor/register',
      data
    );
    console.log('Response for doctor register ', response);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const verifyOtp = async (otp: string, data: {}) => {
  try {
    const response = await doctorAxiosInstance.post('/auth/doctor/verify_otp', {
      otp,
      data,
    });
    console.log('This is the repsonse from otp', response);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const logout = async (id: string) => {
  try {
    const response = await doctorAxiosInstance.post('/auth/doctor/logout', id);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const verification = async (formData: FormData) => {
  try {
    const response = await doctorAxiosInstance.post(
      '/auth/doctor/verify',
      formData
    );
    if (response) {      
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
};

//get data submitted by doctor
export const checkDataSubmitted = async (doctorId: string) => {
  try {    
    if(!doctorId) return null;
    const response = await doctorAxiosInstance.get(
      `/auth/doctor/checkVerification/${doctorId}`
    );
    if (response) {
      return response.data;      
    }
  } catch (error) {
    console.log('Error in checkDataSubmitted----------------', error);
    apiErrorHandler(error);
  }
}

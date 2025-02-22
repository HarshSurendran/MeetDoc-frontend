import apiErrorHandler from '@/utils/apiErrorHandler';
import { doctorAxiosInstance } from '../instance/doctorInstance';
import { IDoctorProfile } from '@/types/IDoctor';
import { ISlotGeneratorForm } from '@/types/ISlots';
import { ICreatePrescriptionDto, IUpdatePrescriptionDto } from '@/types';

export const sendFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await doctorAxiosInstance.post('/s3/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response, 'Response ---------------------');
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const changeProfilePhoto = async (photo: File) => {
  try {
    const formData = new FormData();
    formData.append('photo', photo);
    const response = await doctorAxiosInstance.patch(
      `doctors/profilephoto`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const updateProfile = async (data: Partial<IDoctorProfile>) => {
  try {
    const response = await doctorAxiosInstance.patch(`/doctors`, data);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getPhotoUrl = async (key: string) => {
  try {
    const response = await doctorAxiosInstance.get(`/s3/file/${key}`);
    if (response) {
      return response.data.data.url;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const generateSlots = async (slotdetails: ISlotGeneratorForm) => {
  try {
    const response = await doctorAxiosInstance.post(
      'doctors/generateslots',
      slotdetails
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getSlots = async (doctorId: string) => {
  try {
    const response = await doctorAxiosInstance.get(`doctors/slots/${doctorId}`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getUpcomingAppointments = async (page: number, limit: number) => {
  try {
    const response = await doctorAxiosInstance.get(`doctors/upcomingappointments?page=${page}&limit=${limit}`);    
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getAppointments = async (page:number, limit:number) => {
  try {
    const response = await doctorAxiosInstance.get(`doctors/appointments?page=${page}&limit=${limit}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const createPrescription = async (data: ICreatePrescriptionDto) => {
  try {
    const response = await doctorAxiosInstance.post(
      'doctors/prescription',
      data
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getPatientsForChat = async() => {
  try {
    const response = await doctorAxiosInstance.get(`chat/doctor/recent`);
    if (response) {
      return response.data
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getMessages = async (patientId: string) => {
  try {
    const response = await doctorAxiosInstance.get(`chat/doctor/messages/${patientId}`);
    if (response) {
      return response.data
    }
  } catch (error) {
    apiErrorHandler(error)
  }
}

export const sendMessageApi = async (senderId: string, senderType: string, receiverId: string, content: string) => {
  try {
    const response = await doctorAxiosInstance.post(`chat/message`, { senderId, senderType, receiverId, content });
    if(response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getAppointment = async (id: string) => {
  try {
    const response = await doctorAxiosInstance.get(`doctors/appointments/${id}`);
    if(response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const toggleIsRead = async (senderId: string, receiverId: string) => {
  try {
    const response = await doctorAxiosInstance.post(`chat/toggleisread`, { senderId, receiverId });
    if(response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getDashboardData = async () => {
  try {
    const response = await doctorAxiosInstance.get(`doctors/dashboard`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getGraphData = async () => {
  try {
    const response = await doctorAxiosInstance.get(`doctors/graph`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getMedicalHistory = async(userId: string) => {
  try {
    const response = await doctorAxiosInstance.get(`doctors/medicalhistory/${userId}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const forgotPasswordReq = async (email: string) => {
  try {
    const response = await doctorAxiosInstance.post(`auth/doctor/forgot-password`, { email });
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const resetPasswordDoc = async (token: string, password: string) => {
  try {
    const response = await doctorAxiosInstance.post(`auth/doctor/reset-password`, { token, password });
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getPrescriptions = async () => {
  try {
    const response = await doctorAxiosInstance.get(`doctors/prescriptions`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const editPrescription = async(updateDto: IUpdatePrescriptionDto) => {
  try {
    const response = await doctorAxiosInstance.patch(`doctors/prescription`, updateDto);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}
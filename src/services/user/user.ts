import apiErrorHandler from '@/utils/apiErrorHandler';
import { userAxiosInstance } from '../instance/userInstance';
import { ICreatePatient, IUser } from '@/types/IUser';
import { ISlot } from '@/types/ISlots';
import { ICreateReview,  IUpdateReview } from '@/types';

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
};

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
};

export const changeProfilePhoto = async (id: string, formData: FormData) => {
  try {
    const response = await userAxiosInstance.patch(
      `users/profilephoto/${id}`,
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
    return Promise.reject();
  }
};

export const getProfilePhoto = async (key: string) => {
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
};

export const fetchSingleDoctor = async (doctorId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `users/doctordetails/${doctorId}`
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getSlotsForDoctor = async (doctorId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `users/doctorslots/${doctorId}`
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const updateSlot = async (slotId: string, body: Partial<ISlot>) => {
  try {
    const response = await userAxiosInstance.patch(
      `users/slots/${slotId}`,
      body
    );
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const createPaymentIntent = async (
  slotId: string,
  userId: string,
  doctorId: string,
  fee: number,
  reason: string,
  appointmentFor: string,
  appointmentForName: string,
  date: Date
) => {
  try {
    const response = await userAxiosInstance.post(`/payments/paymentintent`, {
      slotId,
      userId,
      doctorId,
      fee,
      reason,
      appointmentFor,
      appointmentForName,
      date,
    });
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getBookingDetails = async (paymentId: string) => {
  try {
    const response = await userAxiosInstance.get(`users/payment/${paymentId}`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getDoctorsForLandingPage = async () => {
  try {
    const response = await userAxiosInstance.get(`users/doctors/landingpage`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getUserAppointments = async ( page:number, limit: number ) => {
  try {
    const response = await userAxiosInstance.get(`users/appointments?page=${page}&limit=${limit}`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getDoctorsForChat = async() => {
  try {
    const response = await userAxiosInstance.get(`chat/patient/recent`);
    if (response) {
      return response.data
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getMessages = async (doctorId: string) => {
  try {
    const response = await userAxiosInstance.get(`chat/patient/messages/${doctorId}`);
    if (response) {
      return response.data
    }
  } catch (error) {
    apiErrorHandler(error)
  }
}

export const sendMessageApi = async (senderId: string, senderType: "patient" | "doctor", receiverId: string, content: string) => {
  try {
    const response = await userAxiosInstance.post(`chat/message`, { senderId, senderType, receiverId, content });
    if(response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const toggleIsRead = async (senderId: string, receiverId: string) => {
  try {
    const response = await userAxiosInstance.post(`chat/toggleisread`, { senderId, receiverId });
    if(response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const fetchPrescriptions = async (page: number, limit: number) => {
  try {
    const response = await userAxiosInstance.get(`users/prescriptions?page=${page}&limit=${limit}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getAppointment = async (appointmentId: string) => {
  try {
    const response = await userAxiosInstance.get(`users/appointments/${appointmentId}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const sendReview = async (reviewData: ICreateReview) => {
  try {
    const response = await userAxiosInstance.post('review', reviewData);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);    
  }
}

export const getReviews = async (doctorId: string) => {
  try {
    const response = await userAxiosInstance.get(`review/${doctorId}`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getYourReviews = async (page: number, limit: number) => {
  try {
    const response = await userAxiosInstance.get(`users/reviews?page=${page}&limit=${limit}`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const updateReview = async (updateReviewDto: IUpdateReview) => {
  try {
    const response = await userAxiosInstance.patch(`review/${updateReviewDto._id}`, updateReviewDto);
    if (response) {
      return response.data;
    }
    return null;    
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const deleteReview = async ( reviewId: string) => {
  try {
    const response = await userAxiosInstance.delete(`review/${reviewId}`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getNotification = async (id: string) => {
  try {
    const response = await userAxiosInstance.get(`notifications/${id}`);
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const markAsRead = async (notificationId: string) => {
  try {
    const response = await userAxiosInstance.patch(`notifications/${notificationId}`, { isRead: true });
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const markAllAsRead = async (userId: string) => {
  try {
    const response = await userAxiosInstance.patch(`notifications/all/${userId}`, { isRead: true });
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getAllPatients = async () => {
  try {
    const response = await userAxiosInstance.get(`users/patients`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const addPatient = async (data: ICreatePatient) => {
  try {
    const response = await userAxiosInstance.post(`users/patients`, data);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const deletePatient = async (id: string) => {
  try {
    const response = await userAxiosInstance.delete(`users/patients/${id}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const createSubscriptionPaymentIntent = async ( data : {subId: string, userId: string, fee: number, duration: number, date: Date} ) => {
  try {
    const response = await userAxiosInstance.post(`/payments/subscriptionpaymentintent`, data);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error); 
  }
}

export const getSubscriptionDetails = async (sub: string) => {
  try {
    const response = await userAxiosInstance.get(`/subscription/${sub}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error); 
  }
}

export const getAllSubscriptions = async () => {
  try {
    const response = await userAxiosInstance.get(`/subscription`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error); 
  }
}

export const getLastPayment = async() => {
  try {
    const response = await userAxiosInstance.get('users/lastpayment');
    if (response) {
      return response.data;
    }    
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getUpcomingAppointments = async() => {
  try {
    const response = await userAxiosInstance.get('users/upcomingappointments');
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

export const getPaymentHistory = async(page: number, limit: number) => {
  try {
    const response = await userAxiosInstance.get(`users/paymenthistory?page=${page}&limit=${limit}`);
    if (response) {
      return response.data;
    }
  } catch (error) {
    apiErrorHandler(error);
  }
}

import { ReactNode } from "react";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  gender: string;
  phone?: string;
  occupation?: string;
  date_of_birth?: Date;
  isBlocked: Boolean;
  address?: {
    district: string;
    locality: string;
    state: string;
    country: string;
    pincode: string;
  };
  rating?: number;
  photo: string;
  password: string;

  [key: string]: any;
}


export interface Ilogin {
  email: string;
  password?: string;
}


export interface Address {
  district: string;
  locality: string;
  pincode: string;
  state: string;
  country: string;
}


export interface IUserloginResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    gender?: string;  
    phone: string;
    date_of_birth: Date;
    occupation: string;
    address: Address;
    rating: number;
    photo: string;
  };
  accessToken: string;
}


export interface IUserSignUp {
  name: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
}

export interface IUserSignUpError {
  name?: string;
  email?: string;
  password?: string;
  gender?: string;
  phone?: string;
}


export interface IDoctorDetails {
  _id: string,
  name: string,
  specialisation: string,
  consultation: number,
  photo: string,
}

export interface INavigationLinkProps {
    item: {
        name: string;
        href: string;
        icon: any;
    };
    currentPath: string;
    setCurrentPath: (path: string) => void;
    isMobile?: boolean;
}

export interface IBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setReason: (reason: string) => void;
  reason: string;
  doctorDetails: {
    name: string;
    specialisation: string;
    fee: number;
  };
  slotDetails: {
    StartTime: Date;
    EndTime: Date;
  };
  children?: ReactNode;
}



export interface ISlot {
  _id: string;
  doctorId: string;
  StartTime: Date;
  EndTime: Date;
  status: 'Available' | 'Pending' | 'Booked';
  pendingBookingExpiry: Date | null;
}

export interface ISlotsViewProps {
  doctor: { id: string, name: string, specialisation: string, fee: number};
}
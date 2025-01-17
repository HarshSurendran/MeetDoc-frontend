export interface IAddress {
  district: string;
  locality: string;
  pincode: string;
  state: string;
  country: string;
}

export interface IDoctorProfile {
    _id: string;
  name: string;
  email: string;
  gender: string;
  phone: string;  
  date_of_birth: Date;
  occupation: string;
  address: IAddress;
  qualification: string;
  specialisation: string;
  about: string;
  languages: string[];
  fee: number;
  rating: number;
  photo?: string;
}

export interface IDoctorSignup {
  name: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
}

export interface IDoctorSignupErrors {
  name?: string;
  email?: string;
  password?: string;
  gender?: string;
  phone?: string;
}

export interface IEducationFormErrors {
  certificateFile: string;
  yearOfCompletion: string;
  registerationNumber: string;
  city: string;
  speciality: string;
  institution: string;
  university: string;
}

export interface IPersonalDetailsFormErrors {
  name: string;
  age: string;
  email: string;
  phone: string;
  gender: string;
  language: string;
}
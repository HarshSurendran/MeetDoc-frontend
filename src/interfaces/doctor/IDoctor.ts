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
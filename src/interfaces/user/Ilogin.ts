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


export interface IloginResponse {
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

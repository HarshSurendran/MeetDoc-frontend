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
    pincode: number;
  };
  rating?: number;
  photo: string;
  password: string;
}

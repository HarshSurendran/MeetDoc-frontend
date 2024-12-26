
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
    street: string;
    city: string;
    state: string;
    country: string;
  };
  rating?: number;
}
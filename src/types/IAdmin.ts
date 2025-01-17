export interface IloginResponse {
  admin: {
    _id: string;
    name: string;
    email: string;
  };
  adminAccessToken: string;
}


export interface IConsultation {
  date: string;
  doctorName: string;
  specialization: string;
  status: 'completed' | 'cancelled' | 'upcoming';
  amount: number;
}
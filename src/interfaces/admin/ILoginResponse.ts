export interface IloginResponse {
  admin: {
    _id: string;
    name: string;
    email: string;
  };
  adminAccessToken: string;
}

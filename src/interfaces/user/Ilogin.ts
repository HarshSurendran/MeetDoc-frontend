
export interface Ilogin {
    email: string;
    password?: string;
}

export interface IloginResponse {
    user: {
        _id: string;
        name: string;
        email: string;
        gender: string;
    }
    accessToken: string;
}
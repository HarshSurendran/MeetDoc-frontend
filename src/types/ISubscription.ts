export interface ISubscriptionScheme {
    _id: string;
    name: string;
    duration: number;
    price: number;
    discount: number;
    activeUsers: number;
    isDisabled: boolean;
}

export interface ICreateSubscriptionScheme {
    name: string;
    duration: number;
    price: number;
    discount: number;
}
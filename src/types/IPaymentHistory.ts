export interface IPaymentHistory {
    _id: string;
    appointmentForName: string;
    paymentId: string;
    bookingTime: string;
    amount: number;
    paymentStatus: string;
}

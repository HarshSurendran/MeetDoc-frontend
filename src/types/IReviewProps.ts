export interface IReviewModalProp {
    doctorId: string;
    appointmentId: string;
}

export interface ICreateReview {
    for: string;
    rating: number;
    message: string;
    appointmentId: string;
}
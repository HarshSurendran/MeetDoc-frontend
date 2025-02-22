export interface IReviewModalProp {
    doctorId: string;
    appointmentId: string;
}

export interface IReviewSectionProps {
    doctorId: string;
}

export interface ICreateReview {
    for: string;
    rating: number;
    message: string;
    appointmentId: string;
}

export interface IUpdateReview {
    _id: string;
    for: string;
    from?: string;
    rating?: number;
    message?: string;
    appointmentId?: string;
}




export interface IReviewDisplay {
    _id: string;
    for: {
        _id: string;
        name: string;
        specialisation: string;
        };
    from: {
      _id: string;
      name: string;
    };
    message: string;
    rating: number;
    createdAt: string;
}
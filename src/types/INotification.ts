export interface INotification {
    _id: string;
    title: string;
    message: string;
    type: string;
    userId: string;
    isRead: boolean;
    expiryTime: Date;    
}

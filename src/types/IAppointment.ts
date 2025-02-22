export interface IAppointmentDetails {
  doctorName: string;
  specialisation: string;
  appointmentDate: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  appointmentId: string;
  fee: number;
}


export type BookingStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';

export interface IBookedAppointmentType {
  _id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  bookingTime: string;
  date: string;
  time: string;
  duration: number;
  bookingStatus: BookingStatus;
  reason: string;
  meetingLink?: string;
  appointmentFor: string;
  appointmentForName: string;
}
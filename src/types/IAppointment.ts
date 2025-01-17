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


export interface IBookedAppointmentType {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  reason: string;
  meetingLink?: string;
}
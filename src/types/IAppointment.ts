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
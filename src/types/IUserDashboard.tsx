
export interface DashboardAppointmentData {
  _id: string;
  amount: number;
  appointmentForName: string;
  bookingStatus: string;
  bookingTime: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialisation: string;
  endTime: string;
  patientId: string;
  reason: string;
  startTime: string;
}

export interface AppointmentListProps {
  appointments: DashboardAppointmentData[];
}
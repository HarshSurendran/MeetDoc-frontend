
export interface ISlot {
  doctorId: string;
  StartTime: Date;
  EndTime: Date;
  status: 'Available' | 'Pending' | 'Booked';
  pendingBookingExpiry: Date | null;
}

export interface ISlotGeneratorForm {
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: Date | undefined;
  stopTime: Date | undefined;
  duration: number;
}
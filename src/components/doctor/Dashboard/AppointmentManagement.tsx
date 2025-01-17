import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Video, Calendar, Clock, User } from 'lucide-react';
import { BookingStatus, IBookedAppointmentType } from '@/types';
import { getAppointments } from '@/services/doctor/doctor';



interface AppointmentListProps {
  userType: 'doctor' | 'patient';
}

const appointments = [
  {
    _id: "1",
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    date: "2025-01-17",
    time: "10:00 AM",
    duration: 30,
    status: "Scheduled",
    reason: "Annual checkup"
  }
  // ... more appointments
];

const AppointmentManagement: React.FC<AppointmentListProps> = ({
  userType 
}) => {
  const [appointments, setAppointments] = useState<IBookedAppointmentType[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<IBookedAppointmentType | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);


  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const response = await getAppointments();    
    if (response.status) {
      setAppointments(response.data.appointments);
    }
    console.log(appointments);
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'InProgress':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isAppointmentStartingSoon = (appointment: IBookedAppointmentType) => {
    const appointmentTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const diffInMinutes = (appointmentTime.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes <= 15 && diffInMinutes >= -appointment.duration;
  };

  const handleJoinCall = (appointmentId: string) => {
    // Handle video call logic here
    console.log(`Joining call for appointment: ${appointmentId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-800">
            {userType === 'doctor' ? 'My Patient Appointments' : 'My Appointments'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card 
                  key={appointment._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setIsDetailsOpen(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">
                            {userType === 'doctor' ? appointment.patientName : appointment.doctorName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{appointment.date}</span>
                          <Clock className="h-4 w-4 text-gray-500 ml-2" />
                          <span className="text-sm text-gray-600">{appointment.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.bookingStatus)}>
                          {appointment.bookingStatus}
                        </Badge>
                        {isAppointmentStartingSoon(appointment) && (
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinCall(appointment._id);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            {userType === 'doctor' ? 'Start Call' : 'Join Call'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedAppointment && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-800">
                Appointment Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Patient Name</label>
                  <p className="font-semibold">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Doctor Name</label>
                  <p className="font-semibold">{selectedAppointment.doctorName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date & Time</label>
                  <p className="font-semibold">
                    {selectedAppointment.date} at {selectedAppointment.time}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Duration</label>
                  <p className="font-semibold">{selectedAppointment.duration} minutes</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">Reason for Visit</label>
                  <p className="font-semibold">{selectedAppointment.reason}</p>
                </div>
              </div>
              
              {isAppointmentStartingSoon(selectedAppointment) && (
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={() => handleJoinCall(selectedAppointment._id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {userType === 'doctor' ? 'Start Video Call' : 'Join Video Call'}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AppointmentManagement;
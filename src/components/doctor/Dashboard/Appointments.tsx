import React, { useCallback, useEffect, useState } from 'react';
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
import { Video, Calendar, Clock, User, Text, ClipboardPlus } from 'lucide-react';
import { BookingStatus, IBookedAppointmentType } from '@/types';
import { getAppointment, getAppointments, sendMessageApi } from '@/services/doctor/doctor';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/appStore';
import toast from 'react-hot-toast';
import { setAppointmentId } from '@/redux/slices/doctorSlice';
import Pagination from '@/components/Pagination';
import { format, toZonedTime } from 'date-fns-tz';

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<IBookedAppointmentType[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<IBookedAppointmentType | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10'); 
  const [totalDocs, setTotalDocs] = useState(0);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    fetchAppointments(currentPage, Number(pageSize));
  }, [currentPage, pageSize]);

  const convertDateTime = (date: string, time: string): number => {
    const [day, month, year] = date.split("-").map(Number);
    let [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes).getTime();
  };

  const convertToIST = (utcDateString: string) => {
    const timeZone = "Asia/Kolkata";
    const istDate = toZonedTime(utcDateString, timeZone);
    const localDate = format(istDate, "dd-MM-yyyy", { timeZone });
    const localTime = format(istDate, "hh:mm a", { timeZone });
    return {
      localDate,
      localTime
    }
  };

  const fetchAppointments = async (page: number, limit: number) => {   
    const response = await getAppointments(page, limit);    
    if (response.status) {
       const appointments = response.data.appointments.map((appointments: IBookedAppointmentType) => {
        const { localDate, localTime } = convertToIST(appointments.date);
        return {
          ...appointments,
          date: localDate,
          time: localTime
        };
      })
      setAppointments(appointments);
      setTotalDocs(response.data.totalDocs)
    }
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
    const appointmentTime = convertDateTime(appointment.date, appointment.time);
    const now = new Date();
    const diffInMinutes = (appointmentTime- now.getTime()) / (1000 * 60);
    return diffInMinutes <= 15 && diffInMinutes >= -appointment.duration;
  };

  const handleJoinCall = useCallback(async (appointmentData: IBookedAppointmentType) => {
    const response = await getAppointment(appointmentData._id);
    if(!response.status){
      toast.error('Something went wrong. Please try again.');
      return
    }    
    const appointment = response.data.appointment;   
    const response1 = await sendMessageApi(doctor._id, "doctor", appointment.patientId, `Hey ${appointmentData.patientName}, I am Dr.${doctor.name}, are you ready for the video call?`);
    if (response1.status) {
        dispatch(setAppointmentId(appointment._id));
        navigate(`/doctor/chat`)
    }
  }, [navigate]);

  const handleSeeMedicalHistory = useCallback(async (appointmentData: IBookedAppointmentType) => {
    navigate(`/doctor/medical-history/${appointmentData.patientId}`);
  }, [navigate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-800">
            My Patient Appointments
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
                            {`${appointment.patientName} for ${appointment.appointmentForName || "Self"}`} 
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
                              handleJoinCall(appointment);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Text className="h-4 w-4 mr-2" />
                           Start Chat
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
                  <label className="text-sm text-gray-500">Date & Time </label>
                  <p className="font-semibold">
                    {selectedAppointment.date} at {selectedAppointment.time}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Duration/ Booked on</label>
                  <p className="font-semibold">{selectedAppointment.duration} minutes/ {selectedAppointment.bookingTime}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Reason for appointment</label>
                  <p className="font-semibold">{selectedAppointment.reason}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Appointment for</label>
                  <p className="font-semibold">{selectedAppointment.appointmentForName || "Self"}</p>
                </div>
              </div>
              
              {isAppointmentStartingSoon(selectedAppointment) && (
                <div className="flex justify-around mt-4">
                  <Button
                    onClick={() => handleSeeMedicalHistory(selectedAppointment)}
                  >
                    <ClipboardPlus className="h-4 w-4 mr-2" />
                    See Medical History
                  </Button>
                  <Button
                    onClick={() => handleJoinCall(selectedAppointment)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Pagination
        currentPage={currentPage}
        pageSize={Number(pageSize)}
        totalItems={totalDocs}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Appointments;
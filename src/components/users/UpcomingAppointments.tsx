
import { format } from 'date-fns';
import { Calendar, Clock, User, UserRound, Stethoscope, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentListProps } from '@/types';


const UpcomingAppointments = ({ appointments }: AppointmentListProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="w-full  mx-auto mt-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <CardTitle className="text-2xl font-semibold text-blue-900">
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <ScrollArea className="h-[600px]">
                  <CardContent className="divide-y divide-blue-100">
                      {!appointments.length &&  <div className="mt-10 text-2xl text-center text-blue-900 font-semibold p-4">No Upcoming Appointments.</div>}
            {appointments.map((appointment) => (
              <div
                key={appointment._id} 
                className="p-4 mt-2 hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {formatDate(appointment.startTime)}
                      </span>
                      <Clock className="w-5 h-5 text-blue-600 ml-4" />
                      <span className="text-blue-900">
                        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-900 font-medium">
                          {`For: ${appointment.appointmentForName}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserRound className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-900 font-medium">
                          with Dr. {appointment.doctorName}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-700">
                          {appointment.doctorSpecialisation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-900">{appointment.amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-start md:items-end">
                    <Badge className={`${getStatusColor(appointment.bookingStatus)}`}>
                      {appointment.bookingStatus}
                    </Badge>
                    <span className="text-sm text-blue-600">
                      Reason: {appointment.reason}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default UpcomingAppointments;
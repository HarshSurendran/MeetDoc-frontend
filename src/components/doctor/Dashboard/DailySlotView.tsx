
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format, isSameDay } from 'date-fns';
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import { getSlots } from '@/services/doctor/doctor';
import errorHandler from '@/utils/errorHandler';

interface Slot {
  doctorId: string;
  StartTime: Date;
  EndTime: Date;
  status: 'Available' | 'Pending' | 'Booked';
  pendingBookingExpiry: Date | null;
}


const DailySlotView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);

  const doctor = useSelector((state: RootState)=> state.doctor.doctor)

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await getSlots(doctor._id);
      if (response.status) {
        console.log("This is the response after fetching slots", response)
        setSlots(response.data.slots);
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  // Filter slots for selected date
  const dailySlots = slots.filter(slot => 
    isSameDay(new Date(slot.StartTime), selectedDate)
  ).sort((a, b) => new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime());

  const getStatusColor = (status: Slot['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-700';
      case 'Pending':
        return 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700';
      case 'Booked':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: Slot['status'], expiry: Date | null) => {
    if (status === 'Pending' && expiry) {
      return <AlertCircle className="h-4 w-4" />;
    }
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-800">
                Daily Consultation Slots
              </CardTitle>
              <p className="text-gray-500 mt-1">
                Manage your consultation schedule
              </p>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto bg-white hover:bg-blue-50"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                  {format(selectedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date)=> date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Status Legend */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            {['Available', 'Pending', 'Booked'].map((status) => (
              <div
                key={status}
                className="flex items-center"
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  status === 'Available' ? 'bg-emerald-500' :
                  status === 'Pending' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`}/>
                <span className="text-sm text-gray-600">{status}</span>
              </div>
            ))}
          </div>

          {dailySlots.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No slots available for this date.</p>
              <Button variant={'link'}>Click here to create slots.</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {dailySlots.map((slot, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          relative p-4 rounded-lg border-2 transition-all
                          ${getStatusColor(slot.status)}
                        `}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            {getStatusIcon(slot.status, slot.pendingBookingExpiry)}
                            <span className="font-medium">
                              {format(new Date(slot.StartTime), "h:mm a")}
                            </span>
                          </div>
                          <div className="text-center text-sm">
                            {format(new Date(slot.EndTime), "h:mm a")}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {format(new Date(slot.StartTime), "h:mm a")} - {format(new Date(slot.EndTime), "h:mm a")}
                        </p>
                        <p className="text-sm">Status: {slot.status}</p>
                        {slot.status === 'Pending' && slot.pendingBookingExpiry && (
                          <p className="text-sm text-amber-600">
                            Expires: {format(new Date(slot.pendingBookingExpiry), "h:mm a")}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}

          {/* Time Distribution */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Slot Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Available', 'Pending', 'Booked'].map((status) => {
                const count = dailySlots.filter(slot => slot.status === status).length;
                return (
                  <Card key={status}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                        <p className={`text-sm ${
                          status === 'Available' ? 'text-emerald-600' :
                          status === 'Pending' ? 'text-amber-600' :
                          'text-blue-600'
                        }`}>{status} Slots</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailySlotView;

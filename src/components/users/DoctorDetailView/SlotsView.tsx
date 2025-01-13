
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
import errorHandler from '@/utils/errorHandler';
import { getSlotsForDoctor } from '@/services/user/user';
import toast from 'react-hot-toast';
import BookingConfirmationModal from './BookingConfirmationModal';

interface Slot {
    _id: string;
  doctorId: string;
  StartTime: Date;
  EndTime: Date;
  status: 'Available' | 'Pending' | 'Booked';
  pendingBookingExpiry: Date | null;
}

interface SlotsViewProps {
    doctor: { id: string, name: string, specialisation: string, fee: number};
}



const SlotsView: React.FC<SlotsViewProps> = ({doctor}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([
    { _id: "q", doctorId: "1", StartTime: new Date("2025-01-13T09:00:00"), EndTime: new Date("2025-01-13T09:30:00"), status: "Available",pendingBookingExpiry: null },
    { _id: "e", doctorId: "1", StartTime: new Date("2025-01-13T09:30:00"), EndTime: new Date("2025-01-13T10:00:00"), status: "Booked",pendingBookingExpiry: null  },
    { _id: "s", doctorId: "1", StartTime: new Date("2025-01-13T10:00:00"), EndTime: new Date("2025-01-13T10:30:00"), status: "Available",pendingBookingExpiry: null  },
  ]);
    
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await getSlotsForDoctor(doctor.id);
      if (response.status) {
        console.log("This is the response after fetching slots", response)
        setSlots(response.data.slots);
      }
    } catch (error) {
      errorHandler(error);
    }
    }
    

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
    


const handleSlotClick = (slot: Slot) => {
  if (slot.status === 'Available') {
    setSelectedSlot(slot);
      setIsPaymentModalOpen(true);
      return
    }
    toast.error("Sorry! This slot is booked.");
    return;
};

const handleConfirmBooking = () => {
  // Handle payment navigation
  console.log('Proceeding to payment...');
//   setIsPaymentModalOpen(false);
};

    return (
        <div className="min-h- bg-gray-50 p-0 ">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="space-y-1 border-b">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <CardTitle className="text-2xl font-bold text-blue-800">
                                Daily Consultation Slots
                            </CardTitle>
                            <p className="text-gray-500 mt-1">
                                Select the slot for consultation.
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
                                    disabled={(date) => date < new Date(new Date().getTime() - (24 * 60 * 60 * 1000))}
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
                                <div className={`w-3 h-3 rounded-full mr-2 ${status === 'Available' ? 'bg-emerald-500' :
                                        status === 'Pending' ? 'bg-amber-500' :
                                            'bg-blue-500'
                                    }`} />
                                <span className="text-sm text-gray-600">{status}</span>
                            </div>
                        ))}
                    </div>

                    {dailySlots.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No slots available for this date.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {dailySlots.map((slot) => (
                                <TooltipProvider key={slot._id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button onClick={() => handleSlotClick(slot)}><div
                                                className={`
                          relative p-2 rounded-lg border-2 transition-all
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
                                                    {/* <div className="text-center text-sm">
                            {format(new Date(slot.EndTime), "h:mm a")}
                          </div> */}
                                                </div>
                                            </div></button>
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
                                                <p className={`text-sm ${status === 'Available' ? 'text-emerald-600' :
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

            <BookingConfirmationModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirm={handleConfirmBooking}
                doctorDetails={{
                    name: doctor.name,
                    specialisation: doctor.specialisation,
                    fee: doctor.fee,
                }}
                slotDetails={selectedSlot || {
                    StartTime: new Date(),
                    EndTime: new Date(),
                }}
            />
        </div>
    );
};

export default SlotsView;

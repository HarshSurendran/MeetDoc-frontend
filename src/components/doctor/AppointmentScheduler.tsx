// // import React, { useState } from 'react';
// // import { ChevronLeft, ChevronRight } from 'lucide-react';

// // interface TimeSlot {
// //   time: string;
// //   isAvailable: boolean;
// //   isBooked?: boolean;
// // }

// // interface DaySchedule {
// //   date: string;
// //   label: string;
// //   slotsAvailable: number;
// //   slots: TimeSlot[];
// // }

// // const AppointmentScheduler: React.FC = () => {
// //   const [selectedDate, setSelectedDate] = useState(0);

// //   const scheduleData: DaySchedule[] = [
// //     {
// //       date: '2024-03-07',
// //       label: 'Today',
// //       slotsAvailable: 4,
// //       slots: [
// //         { time: '04:00 PM', isAvailable: true },
// //         { time: '05:00 PM', isAvailable: true },
//         { time: '06:00 PM', isAvailable: true },
//         { time: '07:00 PM', isAvailable: true },
//         { time: '08:00 PM', isAvailable: false, isBooked: true },
//         { time: '09:00 PM', isAvailable: true },
//         { time: '10:00 PM', isAvailable: false, isBooked: true },
//         { time: '11:00 PM', isAvailable: false, isBooked: true },
//       ],
//     },
//     {
//       date: '2024-03-08',
//       label: 'Tomorrow',
//       slotsAvailable: 32,
//       slots: [],
//     },
//     {
//       date: '2024-03-09',
//       label: 'Thu, 8 Aug',
//       slotsAvailable: 32,
//       slots: [],
//     },
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
//       <h2 className="text-xl font-semibold mb-4">Appointments</h2>

//       <div className="flex items-center justify-between mb-6">
//         <button
//           className="p-2 hover:bg-gray-100 rounded-full"
//           onClick={() => setSelectedDate(Math.max(0, selectedDate - 1))}
//         >
//           <ChevronLeft className="h-5 w-5" />
//         </button>

//         <div className="flex space-x-8">
//           {scheduleData.map((day, index) => (
//             <div
//               key={day.date}
//               className={`text-center cursor-pointer ${selectedDate === index ? 'text-blue-600' : ''}`}
//               onClick={() => setSelectedDate(index)}
//             >
//               <div className="font-medium">{day.label}</div>
//               <div className="text-sm text-gray-500">
//                 {day.slotsAvailable} slots available
//               </div>
//             </div>
//           ))}
//         </div>

//         <button
//           className="p-2 hover:bg-gray-100 rounded-full"
//           onClick={() =>
//             setSelectedDate(Math.min(scheduleData.length - 1, selectedDate + 1))
//           }
//         >
//           <ChevronRight className="h-5 w-5" />
//         </button>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//         {scheduleData[selectedDate].slots.map((slot, index) => (
//           <div
//             key={index}
//             className={`
//               p-3 rounded-lg text-center border text-sm font-medium
//               ${
//                 slot.isAvailable
//                   ? 'border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer'
//                   : slot.isBooked
//                     ? 'border-red-200 text-red-600 bg-red-50'
//                     : 'border-gray-200 text-gray-400 bg-gray-50'
//               }
//             `}
//           >
//             {slot.time}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AppointmentScheduler;



// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import {
//   ChevronLeft,
//   ChevronRight,
//   CalendarDays,
//   Clock,
//   User,
//   Calendar
// } from 'lucide-react';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/components/ui/tooltip';
// import { format, addDays, isSameDay } from 'date-fns';

// interface Slot {
//   id: string;
//   startTime: Date;
//   endTime: Date;
//   isBooked: boolean;
//   patientName?: string;
// }

// interface SlotDisplayProps {
//   slots: Slot[];
// }

// const DoctorSlotDisplay = ({ slots }: SlotDisplayProps) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [visibleDates, setVisibleDates] = useState(
//     Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))
//   );

//   // Filter slots for selected date
//   const getDaySlots = (date: Date) => {
//     return slots.filter(slot => isSameDay(slot.startTime, date));
//   };

//   const handlePrevWeek = () => {
//     setVisibleDates(prev => prev.map(date => addDays(date, -7)));
//   };

//   const handleNextWeek = () => {
//     setVisibleDates(prev => prev.map(date => addDays(date, 7)));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <Card className="max-w-5xl mx-auto">
//         <CardHeader className="space-y-1">
//           <div className="flex justify-between items-center">
//             <CardTitle className="text-2xl font-bold text-blue-800">
//               Consultation Slots
//             </CardTitle>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="hover:bg-blue-50"
//               >
//                 <Calendar className="h-5 w-5 text-blue-600" />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="bg-white hover:bg-blue-50 text-blue-600"
//               >
//                 Today
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Date Swiper */}
//           <div className="relative">
//             <div className="flex items-center justify-between mb-4">
//               <Button
//                 variant="ghost"
//                 className="hover:bg-blue-50"
//                 onClick={handlePrevWeek}
//               >
//                 <ChevronLeft className="h-6 w-6 text-blue-600" />
//               </Button>
//               <div className="flex space-x-2 md:space-x-4 overflow-x-auto py-2">
//                 {visibleDates.map((date) => (
//                   <Button
//                     key={date.toISOString()}
//                     variant={isSameDay(date, selectedDate) ? "default" : "outline"}
//                     className={`min-w-[120px] ${
//                       isSameDay(date, selectedDate)
//                         ? "bg-blue-600 text-white hover:bg-blue-700"
//                         : "bg-white hover:bg-blue-50"
//                     }`}
//                     onClick={() => setSelectedDate(date)}
//                   >
//                     <div className="flex flex-col items-center">
//                       <span className="text-xs font-medium">
//                         {format(date, "EEE")}
//                       </span>
//                       <span className="text-lg font-bold">
//                         {format(date, "d")}
//                       </span>
//                     </div>
//                   </Button>
//                 ))}
//               </div>
//               <Button
//                 variant="ghost"
//                 className="hover:bg-blue-50"
//                 onClick={handleNextWeek}
//               >
//                 <ChevronRight className="h-6 w-6 text-blue-600" />
//               </Button>
//             </div>
//           </div>

//           {/* Slots Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {getDaySlots(selectedDate).map((slot) => (
//               <TooltipProvider key={slot.id}>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <div
//                       className={`
//                         relative p-4 rounded-lg border-2 transition-all
//                         ${
//                           slot.isBooked
//                             ? "bg-red-50 border-red-200 hover:bg-red-100"
//                             : "bg-green-50 border-green-200 hover:bg-green-100"
//                         }
//                       `}
//                     >
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-center">
//                           <Clock className={`h-4 w-4 ${
//                             slot.isBooked ? "text-red-500" : "text-green-500"
//                           }`} />
//                           <span className="ml-1 text-sm font-medium">
//                             {format(slot.startTime, "h:mm a")}
//                           </span>
//                         </div>
//                         {slot.isBooked && (
//                           <div className="text-center">
//                             <div className="flex items-center justify-center">
//                               <User className="h-4 w-4 text-red-500" />
//                               <span className="ml-1 text-xs text-red-600">
//                                 {slot.patientName}
//                               </span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <div className="space-y-1">
//                       <p className="font-medium">{format(slot.startTime, "h:mm a")} - {format(slot.endTime, "h:mm a")}</p>
//                       <p className="text-sm">
//                         {slot.isBooked
//                           ? `Booked by ${slot.patientName}`
//                           : "Available for booking"
//                         }
//                       </p>
//                     </div>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             ))}
//           </div>

//           {/* Legend */}
//           <div className="flex items-center justify-center space-x-6 pt-4 border-t">
//             <div className="flex items-center">
//               <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-200 mr-2"></div>
//               <span className="text-sm text-gray-600">Available</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-4 h-4 rounded bg-red-50 border-2 border-red-200 mr-2"></div>
//               <span className="text-sm text-gray-600">Booked</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// // Example usage with sample data
// const AppointmentScheduler = () => {
//   const sampleSlots: Slot[] = [
//     {
//       id: '1',
//       startTime: new Date(2024, 0, 12, 9, 0),
//       endTime: new Date(2024, 0, 12, 9, 30),
//       isBooked: false
//     },
//     {
//       id: '2',
//       startTime: new Date(2024, 0, 12, 9, 30),
//       endTime: new Date(2024, 0, 12, 10, 0),
//       isBooked: true,
//       patientName: 'John Doe'
//     },
//     // Add more sample slots as needed
//   ];

//   return <DoctorSlotDisplay slots={sampleSlots} />;
// };

// export default AppointmentScheduler;



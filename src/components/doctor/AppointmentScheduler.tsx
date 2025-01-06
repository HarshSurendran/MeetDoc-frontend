import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBooked?: boolean;
}

interface DaySchedule {
  date: string;
  label: string;
  slotsAvailable: number;
  slots: TimeSlot[];
}

const AppointmentScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(0);

  const scheduleData: DaySchedule[] = [
    {
      date: '2024-03-07',
      label: 'Today',
      slotsAvailable: 4,
      slots: [
        { time: '04:00 PM', isAvailable: true },
        { time: '05:00 PM', isAvailable: true },
        { time: '06:00 PM', isAvailable: true },
        { time: '07:00 PM', isAvailable: true },
        { time: '08:00 PM', isAvailable: false, isBooked: true },
        { time: '09:00 PM', isAvailable: true },
        { time: '10:00 PM', isAvailable: false, isBooked: true },
        { time: '11:00 PM', isAvailable: false, isBooked: true },
      ],
    },
    {
      date: '2024-03-08',
      label: 'Tomorrow',
      slotsAvailable: 32,
      slots: [],
    },
    {
      date: '2024-03-09',
      label: 'Thu, 8 Aug',
      slotsAvailable: 32,
      slots: [],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Appointments</h2>

      <div className="flex items-center justify-between mb-6">
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => setSelectedDate(Math.max(0, selectedDate - 1))}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex space-x-8">
          {scheduleData.map((day, index) => (
            <div
              key={day.date}
              className={`text-center cursor-pointer ${selectedDate === index ? 'text-blue-600' : ''}`}
              onClick={() => setSelectedDate(index)}
            >
              <div className="font-medium">{day.label}</div>
              <div className="text-sm text-gray-500">
                {day.slotsAvailable} slots available
              </div>
            </div>
          ))}
        </div>

        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() =>
            setSelectedDate(Math.min(scheduleData.length - 1, selectedDate + 1))
          }
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {scheduleData[selectedDate].slots.map((slot, index) => (
          <div
            key={index}
            className={`
              p-3 rounded-lg text-center border text-sm font-medium
              ${
                slot.isAvailable
                  ? 'border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer'
                  : slot.isBooked
                    ? 'border-red-200 text-red-600 bg-red-50'
                    : 'border-gray-200 text-gray-400 bg-gray-50'
              }
            `}
          >
            {slot.time}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentScheduler;

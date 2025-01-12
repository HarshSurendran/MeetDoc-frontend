import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import { generateSlots } from '@/services/doctor/doctor';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export interface SlotGeneratorForm {
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: Date | undefined;
  stopTime: Date | undefined;
  duration: number;
}

const SlotGeneration = () => {
  const [form, setForm] = useState<SlotGeneratorForm>({
    startDate: undefined,
    endDate: undefined,
    startTime: undefined,
    stopTime: undefined,
    duration: 30,
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const navigate = useNavigate();

  const commonDurations = [15, 30, 45, 60];
  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return new Date(2024, 0, 1, hour, minute);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    // Combine dates and times
    if (form.startDate && form.endDate && form.startTime && form.stopTime) {
      
      if (form.startDate < new Date()) {
        setError("Please recheck start date.");
        setIsLoading(false);
        return;
      }
    
      if (form.startDate > form.endDate) {
        setError("End date must be greater than start date.");
        setIsLoading(false);

        return;
      }

      if (form.startTime > form.stopTime) {
        setError("End time must be greater than start time.");
        setIsLoading(false);
        return;
      }




      const startDateTime = form.startTime && form.startDate ?
        new Date(
          form.startDate.getFullYear(),
          form.startDate.getMonth(),
          form.startDate.getDate(),
          form.startTime.getHours(),
          form.startTime.getMinutes()
        ) : undefined;

      const stopDateTime = form.stopTime && form.startDate ?
        new Date(
          form.startDate.getFullYear(),
          form.startDate.getMonth(),
          form.startDate.getDate(),
          form.stopTime.getHours(),
          form.stopTime.getMinutes()
        ) : undefined;

      const payload = {
        doctorId: doctor._id, // Replace with actual doctor ID
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: startDateTime,
        stopTime: stopDateTime,
        duration: form.duration
      };

      // Handle submission to your API
      console.log(payload);
      const response = await generateSlots(payload);
      if (response.status) {
        toast.success("Succesfully created slots.");
        navigate('/doctor/appointments')
      }
    } else {
      setError("Please enter every fields.");
      setIsLoading(false);
      return
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-blue-800">
            Generate Consultation Slots
          </CardTitle>
          <p className="text-gray-500">
            Set your availability and create consultation time slots
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Range Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.startDate ? (
                        format(form.startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.startDate}
                      onSelect={(date) => setForm({ ...form, startDate: date })}
                      disabled={(date) => 
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.endDate ? (
                        format(form.endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.endDate}
                      onSelect={(date) => setForm({ ...form, endDate: date })}
                      disabled={(date) => form.startDate? date < (form.startDate || new Date()) : true }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Time Range Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {form.startTime ? (
                        format(form.startTime, "hh:mm a")
                      ) : (
                        <span>Select time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="h-48 overflow-y-auto">
                      {timeSlots.map((time) => (
                        <Button
                          key={time.toISOString()}
                          variant="ghost"
                          className="w-full justify-start font-normal"
                          onClick={() => {
                            setForm({ ...form, startTime: time });
                          }}
                        >
                          {format(time, "hh:mm a")}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Stop Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {form.stopTime ? (
                        format(form.stopTime, "hh:mm a")
                      ) : (
                        <span>Select time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="h-48 overflow-y-auto">
                      {timeSlots
                        .filter((time) => !form.startTime || time > form.startTime)
                        .map((time) => (
                          <Button
                            key={time.toISOString()}
                            variant="ghost"
                            className="w-full justify-start font-normal"
                            onClick={() => {
                              setForm({ ...form, stopTime: time });
                            }}
                          >
                            {format(time, "hh:mm a")}
                          </Button>
                        ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Slot Duration */}
            <div className="space-y-2">
              <Label>Slot Duration (minutes)</Label>
              <div className="space-y-4">
                <Select
                  value={form.duration.toString()}
                  onValueChange={(value) => 
                    setForm({ ...form, duration: parseInt(value) })
                  }
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonDurations.map((duration) => (
                      <SelectItem 
                        key={duration} 
                        value={duration.toString()}
                      >
                        {duration} minutes
                      </SelectItem>
                    ))}
                    {/* <SelectItem value="custom">Custom</SelectItem> */}
                  </SelectContent>
                </Select>

                {error ? <p className='text-red-700'>{error}</p>: ""}
                
                {/* {form.duration === 'custom' && (
                  <Input
                    type="number"
                    placeholder="Enter duration in minutes"
                    className="bg-white"
                    onChange={(e) => 
                      setForm({ ...form, duration: parseInt(e.target.value) })
                    }
                    min={5}
                    step={5}
                  />
                )} */}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-blue-800">Slot Generation Preview</h3>
              <div className="text-sm text-blue-600">
                {form.startDate && form.endDate && form.startTime && form.stopTime ? (
                  <div className="space-y-1">
                    <p>Date Range: {format(form.startDate, "PPP")} to {format(form.endDate, "PPP")}</p>
                    <p>Time Range: {format(form.startTime, "hh:mm a")} to {format(form.stopTime, "hh:mm a")}</p>
                    <p>Slot Duration: {form.duration} minutes</p>
                  </div>
                ) : (
                  <p>Please fill in all fields to see slot generation preview</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading? "Loading...":"Generate Slots" }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlotGeneration;
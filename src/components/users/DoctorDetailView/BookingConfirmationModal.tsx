import React, { useEffect, useState } from 'react';
import { format} from 'date-fns';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarClock, CreditCard, User, Stethoscope, AlertCircle } from "lucide-react";
import { IBookingModalProps, IPatient } from '@/types';
import { getAllPatients } from '@/services/user/user';
import errorHandler from '@/utils/errorHandler';

const BookingConfirmationModal: React.FC<IBookingModalProps> = ({
  isOpen,
  onClose,
  setReason,
  onConfirm,
  setAppointmentFor,
  setAppointmentForName,
  appointmentFor,
  reason,
  doctorDetails,
  slotDetails,
}) => {
  const [error, setError] = useState('');
  const [relatives, setRelatives] = useState<IPatient[]>([]);
  // const [selectedPatient, setSelectedPatient] = useState("Self");
  useEffect(() => {
    fetchPatients();
  }, []);

  
  const fetchPatients = async () => {
    try {
      const response = await getAllPatients();
      if (response?.status) {
          console.log("Other patients", response.data.patients);
          setRelatives(response.data.patients);
      }
      } catch (error) {
          errorHandler(error);
      }
  }

  const handleSelectedRealtive = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAppointmentFor(e.target.value);
    const selectedRelative = relatives.filter((relative) => relative._id === e.target.value);

    if (selectedRelative.length > 0) {
      setAppointmentForName(selectedRelative[0].name);
    } else {
      setAppointmentForName("");
    }
    
  }

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please enter the reason for your appointment.');
      return;
    }
    setError('');
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Confirm Booking
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Please review your appointment details
          </DialogDescription>
        </DialogHeader>

        {/* Booking Details */}
        <div className="space-y-6 py-4">
          {/* Doctor Info */}
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
            <User className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900">{doctorDetails.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">{doctorDetails.specialisation}</span>
              </div>
            </div>
          </div>

          {/* Time Slot */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <CalendarClock className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900">Appointment Time</h4>
              <p className="text-sm text-gray-600">
                {format(slotDetails.StartTime, 'MMMM d, yyyy')}
                <br />
                {format(slotDetails.StartTime, 'h:mm a')} - {format(slotDetails.EndTime, 'h:mm a')}
              </p>
            </div>
          </div>

          {/* Fee Details */}
          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
            <CreditCard className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-green-900">Consultation Fee</h4>
              <p className="text-sm text-green-700">
                ₹ {doctorDetails.fee}
              </p>
            </div>
          </div>

          {/* Select Patient */}
          <div className="space-y-6 py-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Who is this appointment for?</label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={appointmentFor}
              onChange={(e) => handleSelectedRealtive(e)}
            >
              <option value="self">Self</option>
              {relatives.map((relative) => (
                <option key={relative._id} value={relative._id}>
                  {relative.name} ({relative.relation})
                </option>
              ))}
            </select>
            </div>
            </div>

          {/* Reason for Appointment Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Reason for Appointment <span className="text-red-500">*</span></label>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the reason for your appointment"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {error && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Proceed to Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationModal;
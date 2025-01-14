import React, { ReactNode } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarClock, CreditCard, User, Stethoscope } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  doctorDetails: {
    name: string;
    specialisation: string;
    fee: number;
  };
  slotDetails: {
    StartTime: Date;
    EndTime: Date;
  };
  children?: ReactNode;
}

const BookingConfirmationModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  doctorDetails,
  slotDetails,
  children
}) => {
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
        </div>

        {/* {children && <div className="mt-4">{children}</div>} */}


        {/* Action Buttons */}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
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
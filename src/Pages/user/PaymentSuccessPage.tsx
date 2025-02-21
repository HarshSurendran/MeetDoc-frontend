import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Home,
  CalendarClock,
  Download
} from "lucide-react";
import { format } from 'date-fns';
import { getBookingDetails } from '@/services/user/user';
import { IAppointmentDetails } from '@/types';
import LoadingAnimation from '../LoadingAnimation';
import PaymentFailurePage from './PaymentFailurePage';




const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<IAppointmentDetails>({
    doctorName: "",
    specialisation: "",
    appointmentDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    location: "",
    appointmentId: "",
    fee: 0,
  });
  
    const navigate = useNavigate();
    
    
    useEffect(() => {
      if (paymentIntentId) {
          if(redirectStatus === 'succeeded') {
            setTimeout(() => {
              fetchAppointmentDetails();
            }, 500);
          } else {
            setPaymentFailed(true);            
          }
        }
    }, []);

  const fetchAppointmentDetails = async () => {
    if (paymentIntentId) {
      const response = await getBookingDetails(paymentIntentId);
      console.log("response", response);
      if (response?.status) {
        setAppointmentDetails(response.data.bookingDetails);
      } else {
        setPaymentFailed(true);
      }
    }
  };

  const retryPaymentFunction = () => {
    console.log("retryPayment clicked")
    navigate(`/users/payment`);
  }


        

  return (
  <>
      {appointmentDetails.fee > 0 ?
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Success Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Appointment Confirmed!
              </h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Your appointment has been successfully booked. We've sent a confirmation email with all the details.
              </p>
            </div>

            {/* Appointment Details Card */}
            <Card className="border-2 border-blue-100">
              <CardContent className="p-6 space-y-6">
                {/* Appointment ID */}
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-sm text-gray-500">Appointment ID</span>
                  <span className="font-mono font-medium">{appointmentDetails.appointmentId}</span>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Doctor Details */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-medium">Doctor</h3>
                        <p className="text-gray-600">Dr. {appointmentDetails.doctorName}</p>
                        <p className="text-sm text-gray-500">{appointmentDetails.specialisation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-medium">Date & Time</h3>
                        <p className="text-gray-600">
                          {format(appointmentDetails.appointmentDate, 'MMMM d, yyyy')}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {format(appointmentDetails.startTime, 'h:mm a')} - {format(appointmentDetails.endTime, 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-gray-600">Video Consultation</p>
                        <p className="text-sm text-gray-500">Join link will be sent via email</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-medium">Payment Status</h3>
                        <p className="text-gray-600">Paid: ₹{appointmentDetails.fee}</p>
                        <p className="text-sm text-green-600">Payment Successful</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {/* Handle download */ }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Appointment Details
                </Button>
              </CardContent>
            </Card>

            {/* Important Instructions */}
            <Card className="bg-blue-50 border-none">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Important Instructions</h3>
                <ul className="space-y-3">
                  {[
                    'Please join the video consultation 5 minutes before the scheduled time',
                    'Ensure you have a stable internet connection',
                    'Keep your medical history and current medications list handy',
                    'You can reschedule up to 24 hours before the appointment'
                  ].map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-2 text-blue-700">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                variant="outline"
                className="flex-1 sm:flex-initial"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/appointments')}
              >
                <CalendarClock className="w-4 h-4 mr-2" />
                View All Appointments
              </Button>
            </div>
          </div>
        </div>
        : paymentFailed ? <PaymentFailurePage failureReason='Bank not responding' retryPayment={retryPaymentFunction} /> : <LoadingAnimation />}
  
      </>
)};

export default PaymentSuccessPage;
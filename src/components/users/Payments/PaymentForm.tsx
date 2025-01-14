import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, CreditCard, Shield, CheckCircle } from "lucide-react";
import { format } from 'date-fns';
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/appStore";



const PaymentForm: React.FC<{    
    onBack: () => void;
  }> = ({ onBack }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const paymentDetails = useSelector((state: RootState) => state.payment.payment);

      
     const appointmentDetails = {
       doctorName: paymentDetails.doctor.name,
        specialisation: paymentDetails.doctor.specialisation,
        appointmentDate: paymentDetails.startTime,
        startTime: paymentDetails.startTime,
        endTime: paymentDetails.endTime,
        fee: paymentDetails.fee,
      };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!stripe || !elements) {
        return;
      }
  
      setIsLoading(true);
      setPaymentError(null);
  
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });
  
      if (error) {
        setPaymentError(error.message ?? 'An error occurred with your payment');
      }
      
      setIsLoading(false);
    };
  
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Payment Form Section */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <PaymentElement
                      options={{
                        layout: 'tabs',
                      }}
                    />
                    
                    {paymentError && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        {paymentError}
                      </div>
                    )}
  
                    <Button
                      type="submit"
                      disabled={!stripe || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <Clock className="animate-spin mr-2 h-4 w-4" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay ₹ {appointmentDetails.fee}
                        </span>
                      )}
                    </Button>
                  </form>
  
                  <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Payments are secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>
            </div>
  
            {/* Order Summary Section */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Doctor</h4>
                    <p className="text-sm text-gray-600">Dr. {appointmentDetails.doctorName}</p>
                    <p className="text-sm text-gray-500">{appointmentDetails.specialisation}</p>
                  </div>
  
                  <div>
                    <h4 className="font-medium text-gray-700">Date & Time</h4>
                    <p className="text-sm text-gray-600">
                      {format(appointmentDetails.appointmentDate, 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(appointmentDetails.startTime, 'h:mm a')} - {format(appointmentDetails.endTime, 'h:mm a')}
                    </p>
                  </div>
  
                  <Separator />
  
                  <div className="pt-2">
                    <div className="flex justify-between items-center font-medium">
                      <span>Consultation Fee</span>
                      <span>₹{appointmentDetails.fee}</span>
                    </div>
                  </div>
  
                  {/* Benefits Section */}
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">What's Included</h4>
                    <ul className="space-y-2">
                      {[
                        'Video consultation',
                        'Digital prescription',
                        'Follow-up messages',
                        '24/7 support'
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-blue-700">
                          <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
    };
  
export default PaymentForm;
  
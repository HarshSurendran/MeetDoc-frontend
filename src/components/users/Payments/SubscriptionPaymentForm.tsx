import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, CreditCard, Shield} from "lucide-react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";



const SubscriptionPaymentForm: React.FC<{    
    onBack: () => void;
    price: number
  }> = ({ onBack, price}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    
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
          return_url: `${window.location.origin}/dashboard`,
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
  
          <div className="grid grid-cols-1 ">
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
                          Pay ₹ {price}
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
          </div>
        </div>
      </div>
    );
    };
  
export default SubscriptionPaymentForm;
  
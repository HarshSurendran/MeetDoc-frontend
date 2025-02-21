import { useNavigate } from "react-router-dom";
import { XCircle, Home, CalendarClock, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaymentFailureProps {
  failureReason?: string;
  retryPayment: () => void;
}

const PaymentFailurePage: React.FC<PaymentFailureProps> = ({ failureReason, retryPayment }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Failed
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Oops! Something went wrong with your payment. Please try again or contact support.
          </p>
        </div>

        
        <Card className="border-2 border-red-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm text-gray-500">Failure Reason</span>
              <span className="font-medium text-red-600">
                {failureReason || "Unknown Error"}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">What You Can Do:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Check your card details and try again.</li>
                <li>Ensure your bank allows online transactions.</li>
                <li>If the issue persists, contact your bank or try another payment method.</li>
              </ul>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={retryPayment}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Payment
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            variant="outline"
            className="flex-1 sm:flex-initial"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button
            className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/appointments")}
          >
            <CalendarClock className="w-4 h-4 mr-2" />
            View Appointments
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;

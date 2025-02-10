import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Calendar, CreditCard, FileText } from 'lucide-react'
import errorHandler from '@/utils/errorHandler';
import { getLastPayment, getSubscriptionDetails, getUpcomingAppointments } from '@/services/user/user';
import { format, parseISO, set } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import PremiumSubscription from './PremiumSubscription';
import { DashboardAppointmentData } from '@/types';
import UpcomingAppointments from './UpcomingAppointments';

const Dashboard = () => {
  const [lastPayment, setLastPayment] = useState<{ price: string, date: string }>({
    price: '',
    date: ''
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState<{length: number, startTime: string}>({
    length: 0,
    startTime: ''
  })
  const [subscription, setSubscription] = useState<{name: string, discount: number}>({
    name: "Not Subscribed",
    discount: 0,
  });
  const [detailedAppointments, setDetailedAppointments] = useState<DashboardAppointmentData[]>([]);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await getPaymentData();
    await getAppointmentData();
    if (user.isSubscribed) {
      await getSubscription(user.subscriptionId);
    }
  }

  const getAppointmentData = async () => {
    try {
      const response = await getUpcomingAppointments();
      if (response.status) {
        const currentTime = new Date();
        const appointments = response.data.appointments
          .filter((doc: { startTime: string }) => {
            return new Date(doc.startTime) > currentTime
          })
        .sort((a:any, b:any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        console.log("appointments", appointments)
        setDetailedAppointments(appointments);
        if (appointments.length > 0) {
          setUpcomingAppointments({ length: appointments.length, startTime: format(parseISO(appointments[0].startTime), "dd MMM yyyy 'at' hh:mm a") });
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  const getPaymentData = async () => {
    try {
      const response = await getLastPayment();
      if(response.status){
        setLastPayment({ price: response.data.lastPayment.amount, date: format(parseISO(response.data.lastPayment.bookingTime), "dd MMM yyyy") });
      }

    } catch (error) {
      errorHandler(error);
    }
  }

  const getSubscription = async (subscriptionId: string) => {
    try {
      const response = await getSubscriptionDetails(subscriptionId);
      if (response.status) {
        setSubscription(response.data.scheme)
        console.log("Fot subscriptionDetails", response.data);
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-2">
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</div>
            <p className="text-xs text-gray-500">{upcomingAppointments.length > 0 && `Next: ${upcomingAppointments.startTime}`}</p>
          </CardContent>
        </Card>
            
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Your Subscription
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{subscription.name}</div>
            <p className="text-xs text-gray-500">{subscription.discount > 0 && `${subscription.discount}% discount on every appointment`}</p>
          </CardContent>
        </Card>
            
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Recent Payments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{lastPayment.price ? `₹ ${lastPayment.price}` : `Null`}</div>
            <p className="text-xs text-gray-500">{lastPayment.date ? `Last payment on :  ${lastPayment.date}` : ""}</p>
          </CardContent>
        </Card>
            
        {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Feedback Rating
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">4.8</div>
          <p className="text-xs text-gray-500">Based on 12 consultations</p>
        </CardContent>
      </Card> */}
      </div>   
      { !user.isSubscribed &&
        <div className="bg-white py-3 rounded-lg shadow-lg">
          <h2 className="my-4 text-3xl text-center font-bold text-gray-600 ">Subscription Plans</h2>
          <PremiumSubscription />
        </div>
      }
      
        <UpcomingAppointments appointments={detailedAppointments} />
      
      
    </div>
  );
};

export default Dashboard

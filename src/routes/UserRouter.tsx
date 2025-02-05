import { Route, Routes } from 'react-router-dom';
import PublicRoute from '../hocs/users/PublicRoute';
import LoginPage from '../Pages/user/LoginPage';
import PrivateRoute from '../hocs/users/PrivateRoute';
import SignupPage from '../Pages/user/SignupPage';
import OtpPage from '../Pages/user/OtpPage';
import LandingPage from '../Pages/user/LandingPage';
import UserProfilePage from '@/components/users/UserProfile';
import UserDashboardLayout from '@/Pages/user/UserDashboardLayout';
import Dashboard from '@/components/users/Dashboard';
import UserErrorPage from '@/Pages/user/UserErrorPage';
import DoctorDetailPage from '@/Pages/user/DoctorDetailPage';
import PaymentPage from '@/components/users/Payments/PaymentPage';
import PaymentRoute from '@/hocs/users/PaymentRoute';
import PaymentSuccessPage from '@/Pages/user/PaymentSuccessPage';
import AppointmentManagement from '@/components/AppointmentManagement';
import UserChatInterface from '@/Pages/user/UserChatInterface';
import UserVideoCallPage from '@/Pages/user/UserVideoCallPage';
import PrescriptionPage from '@/components/users/PrescriptionSection';
import UserReviewsPage from '@/Pages/user/YourReviewsPage';
import PatientManagementPage from '@/Pages/user/PatientManagementPage';
import SubscriptionPaymentPage from '@/components/users/Payments/SubscriptionPaymentPage';
import ForgotPasswordPage from '@/Pages/user/forgotPasswordPage';
import ResetPasswordPage from '@/Pages/user/ResetPasswordPage';

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute component={LoginPage} />} />
      <Route path='/forgot-password' element={<PublicRoute component={ForgotPasswordPage} />} />
      <Route path='/reset-password/:token' element={<PublicRoute component={ResetPasswordPage} />} />
      <Route path="/signup" element={<PublicRoute component={SignupPage} />} />
      <Route path="/otp" element={<PublicRoute component={OtpPage} />} />
      <Route path="/doctordetail/:id" element={<PrivateRoute component={DoctorDetailPage} />} />
      <Route path="users/payment" element={<PaymentRoute component={PaymentPage} />} />
      <Route path="/payment-success" element={<PaymentSuccessPage/>}/>
      <Route path='subscriptionpayment/:subId' element={ <SubscriptionPaymentPage />} />
      <Route element={<PrivateRoute component={UserDashboardLayout} />}>
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="appointments" element={<AppointmentManagement userType='patient' />} />
        <Route path='prescription' element={<PrescriptionPage />} />
        <Route path='usermanagement' element={<PatientManagementPage />} />
        <Route path='reviews' element={<UserReviewsPage />}/>        
      </Route>
      <Route path='/video-call/:id' element={<PrivateRoute component={UserVideoCallPage} />} />
      <Route path='chat' element={<PrivateRoute component={UserChatInterface} />} />
      <Route path='*' element={<UserErrorPage/>} />
    </Routes>
  );
};

export default UserRouter;

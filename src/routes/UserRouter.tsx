import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PublicRoute from '../hocs/users/PublicRoute';
import PrivateRoute from '../hocs/users/PrivateRoute';
import PaymentRoute from '../hocs/users/PaymentRoute';
import LoadingAnimation from '@/Pages/LoadingAnimation';

const LandingPage = lazy(() => import('../Pages/user/LandingPage'));
const LoginPage = lazy(() => import('../Pages/user/LoginPage'));
const SignupPage = lazy(() => import('../Pages/user/SignupPage'));
const OtpPage = lazy(() => import('../Pages/user/OtpPage'));
const ForgotPasswordPage = lazy(() => import('../Pages/user/forgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../Pages/user/ResetPasswordPage'));
const DoctorDetailPage = lazy(() => import('../Pages/user/DoctorDetailPage'));
const PaymentPage = lazy(() => import('@/components/users/Payments/PaymentPage'));
const PaymentSuccessPage = lazy(() => import('../Pages/user/PaymentSuccessPage'));
const SubscriptionPaymentPage = lazy(() => import('@/components/users/Payments/SubscriptionPaymentPage'));
const UserDashboardLayout = lazy(() => import('@/Pages/user/UserDashboardLayout'));
const Dashboard = lazy(() => import('@/components/users/Dashboard'));
const UserProfilePage = lazy(() => import('@/components/users/UserProfile'));
const AppointmentManagement = lazy(() => import('@/components/AppointmentManagement'));
const PrescriptionPage = lazy(() => import('@/components/users/PrescriptionSection'));
const PatientManagementPage = lazy(() => import('../Pages/user/PatientManagementPage'));
const UserReviewsPage = lazy(() => import('../Pages/user/YourReviewsPage'));
const PaymentHistory = lazy(() => import('@/components/users/PaymentHistory'));
const VideoCallPage = lazy(() => import('../Pages/VideoCallPage'));
const UserChatInterface = lazy(() => import('../Pages/user/UserChatInterface'));
const UserErrorPage = lazy(() => import('../Pages/user/UserErrorPage'));

const UserRouter = () => {
  return (
    <Suspense fallback={<LoadingAnimation/>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute component={LoginPage} />} />
        <Route path="/forgot-password" element={<PublicRoute component={ForgotPasswordPage} />} />
        <Route path="/reset-password/:token" element={<PublicRoute component={ResetPasswordPage} />} />
        <Route path="/signup" element={<PublicRoute component={SignupPage} />} />
        <Route path="/otp" element={<PublicRoute component={OtpPage} />} />
        <Route path="/doctordetail/:id" element={<PrivateRoute component={DoctorDetailPage} />} />
        <Route path="/users/payment" element={<PaymentRoute component={PaymentPage} />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/subscriptionpayment/:subId" element={<SubscriptionPaymentPage />} />
        
        <Route element={<PrivateRoute component={UserDashboardLayout} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/appointments" element={<AppointmentManagement userType="patient" />} />
          <Route path="/prescription" element={<PrescriptionPage />} />
          <Route path="/usermanagement" element={<PatientManagementPage />} />
          <Route path="/reviews" element={<UserReviewsPage />} />
          <Route path="/payments" element={<PaymentHistory />} />
        </Route>
        
        <Route path="/video-call/:id" element={<PrivateRoute component={VideoCallPage} />} />
        <Route path="/chat" element={<PrivateRoute component={UserChatInterface} />} />
        <Route path="*" element={<UserErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default UserRouter;

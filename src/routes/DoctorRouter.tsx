import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PrivateRoute from '../hocs/doctors/PrivateRoute';
import PublicRoute from '../hocs/doctors/PublicRoute';
import LoadingAnimation from '@/Pages/LoadingAnimation';

const DoctorRegistration = lazy(() => import('../Pages/doctor/DoctorVerificaiton'));
const LoginPage = lazy(() => import('../Pages/doctor/LoginPage'));
const SignupPage = lazy(() => import('../Pages/doctor/SignupPage'));
const OtpPage = lazy(() => import('../Pages/doctor/OtpPage'));
const DashboardStats = lazy(() => import('@/components/doctor/Dashboard/DashboardStats'));
const DashboardLayout = lazy(() => import('@/Pages/doctor/DashboardLayout'));
const DoctorProfile = lazy(() => import('@/components/doctor/Dashboard/DoctorProfile'));
const SlotGeneration = lazy(() => import('@/components/doctor/Dashboard/SlotGeneration'));
const DailySlotView = lazy(() => import('@/components/doctor/Dashboard/DailySlotView'));
const AppointmentManagement = lazy(() => import('@/components/AppointmentManagement'));
const PrescriptionForm = lazy(() => import('@/Pages/doctor/CreatePrescription'));
const ChatInterface = lazy(() => import('@/Pages/doctor/ChatInterface'));
const DoctorErrorPage = lazy(() => import('@/Pages/doctor/DoctorErrorPage'));
const MedicalHistory = lazy(() => import('@/Pages/doctor/PatientHistoryPage'));
const DocForgotPasswordPage = lazy(() => import('@/Pages/doctor/DocForgotPasswordPage'));
const DocResetPasswordPage = lazy(() => import('@/Pages/doctor/DocResetPasswordPage'));
const VideoCallPage = lazy(() => import('@/Pages/VideoCallPage'));
const PrescriptionList = lazy(() => import('@/components/doctor/Dashboard/PrescriptionList'));
const Appointments = lazy(() => import('@/components/doctor/Dashboard/Appointments'));

const DoctorRouter = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <Routes>
        <Route path="/" element={<PrivateRoute component={DashboardLayout} />}>
          <Route path="dashboard" element={<DashboardStats />} />
          <Route path="slotsview" element={<DailySlotView />} />
          <Route path="slots" element={<SlotGeneration />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="settings" element={<div>Settings Page</div>} />
          <Route path="bookedappointments" element={<AppointmentManagement userType="doctor" />} />
          <Route path="prescriptions" element={<PrescriptionList />} />
          <Route path="prescription/:id" element={<PrescriptionForm />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="/medical-history/:id" element={<PrivateRoute component={MedicalHistory} />} />
        </Route>
        <Route path="/videocall/:id" element={<PrivateRoute component={VideoCallPage} />} />
        <Route path="/chat" element={<ChatInterface />} />

        {/* Public Routes */}
        <Route path="/registration" element={<PublicRoute component={DoctorRegistration} />} />
        <Route path="/login" element={<PublicRoute component={LoginPage} />} />
        <Route path="/signup" element={<PublicRoute component={SignupPage} />} />
        <Route path="/otp" element={<PublicRoute component={OtpPage} />} />
        <Route path="/forgot-password" element={<PublicRoute component={DocForgotPasswordPage} />} />
        <Route path="/reset-password/:token" element={<PublicRoute component={DocResetPasswordPage} />} />
        <Route path="*" element={<DoctorErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default DoctorRouter;

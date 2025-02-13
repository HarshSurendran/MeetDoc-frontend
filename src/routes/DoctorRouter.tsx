import { Route, Routes } from 'react-router-dom';
import DoctorRegistration from '../Pages/doctor/DoctorVerificaiton';
import LoginPage from '../Pages/doctor/LoginPage';
import SignupPage from '../Pages/doctor/SignupPage';
import OtpPage from '../Pages/doctor/OtpPage';
import PrivateRoute from '../hocs/doctors/PrivateRoute';
import PublicRoute from '../hocs/doctors/PublicRoute';
import DashboardStats from '@/components/doctor/Dashboard/DashboardStats';
import DashboardLayout from '@/Pages/doctor/DashboardLayout';
import DoctorProfile from '@/components/doctor/Dashboard/DoctorProfile';
import SlotGeneration from '@/components/doctor/Dashboard/SlotGeneration';
import DailySlotView from '@/components/doctor/Dashboard/DailySlotView';
import AppointmentManagement from '@/components/AppointmentManagement';
import PrescriptionForm from '@/Pages/doctor/CreatePrescription';
import ChatInterface from '@/Pages/doctor/ChatInterface';
import DoctorErrorPage from '@/Pages/doctor/DoctorErrorPage';
import VideoCallTest from '@/Pages/doctor/VideoCallTest';
import MedicalHistory from '@/Pages/doctor/PatientHistoryPage';
import DocForgotPasswordPage from '@/Pages/doctor/DocForgotPasswordPage';
import DocResetPasswordPage from '@/Pages/doctor/DocResetPasswordPage';
import VideoCallPage from '@/Pages/VideoCallPage';
import MyVideoCallPage from '@/Pages/MyVideoCallPage';



const DoctorRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute component={DashboardLayout} />}>
        <Route path="dashboard" element={<DashboardStats />} />
        <Route path="appointments" element={<DailySlotView />} />
        <Route path="slots" element={<SlotGeneration />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="settings" element={<div>Settings Page</div>} />
        <Route path='bookedappointments' element={<AppointmentManagement userType='doctor' />} />
        <Route path='prescription/:id' element={<PrescriptionForm />} />
        <Route path='/medical-history/:id' element={<PrivateRoute component={MedicalHistory} />} />
      </Route>
      <Route path="/videocall/:id" element={<PrivateRoute component={MyVideoCallPage} />} />      
      <Route path='/chat' element={<ChatInterface />} />

      <Route
        path="/registration"
        element={<PublicRoute component={DoctorRegistration} />}
      />
      <Route path="/login" element={<PublicRoute component={LoginPage} />} />
      <Route path="/signup" element={<PublicRoute component={SignupPage} />} />
      <Route path="/otp" element={<PublicRoute component={OtpPage} />} />
      <Route path='/forgot-password' element={<PublicRoute component={DocForgotPasswordPage} />} />
      <Route path='/reset-password/:token' element={<PublicRoute component={DocResetPasswordPage} />} />
      <Route path='*' element={<DoctorErrorPage/>} />
    </Routes>
  );
};

export default DoctorRouter;

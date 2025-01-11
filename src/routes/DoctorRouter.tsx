import { Route, Routes } from 'react-router-dom';
import DoctorRegistration from '../Pages/doctor/DoctorVerificaiton';
import LoginPage from '../Pages/doctor/LoginPage';
import SignupPage from '../Pages/doctor/SignupPage';
import OtpPage from '../Pages/doctor/OtpPage';
import PrivateRoute from '../hocs/doctors/PrivateRoute';
import PublicRoute from '../hocs/doctors/PublicRoute';
import DashboardStats from '@/components/doctor/DashboardStats';
import AppointmentScheduler from '@/components/doctor/AppointmentScheduler';
import DashboardLayout from '@/Pages/doctor/DashboardLayout';
import DoctorProfile from '@/components/doctor/Dashboard/DoctorProfile';

const DoctorRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute component={DashboardLayout} />}>
        <Route path="dashboard" element={<DashboardStats />} />
        <Route path="appointments" element={<AppointmentScheduler />} />
        <Route path="revenue" element={<div>Revenue Page</div>} />
        <Route path="profile" element={<DoctorProfile/>} />
        <Route path="settings" element={<div>Settings Page</div>} />
      </Route>

      <Route
        path="/registration"
        element={<PublicRoute component={DoctorRegistration} />}
      />
      <Route path="/login" element={<PublicRoute component={LoginPage} />} />
      <Route path="/signup" element={<PublicRoute component={SignupPage} />} />
      <Route path="/otp" element={<PublicRoute component={OtpPage} />} />
    </Routes>
  );
};

export default DoctorRouter;

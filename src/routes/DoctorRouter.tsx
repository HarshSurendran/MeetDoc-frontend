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
import AppointmentManagement from '@/components/doctor/Dashboard/AppointmentManagement';

const appointments = [
  {
    id: "1",
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    date: "2025-01-17",
    time: "10:00 AM",
    duration: 30,
    status: "scheduled",
    reason: "Annual checkup"
  }
  // ... more appointments
];

const DoctorRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute component={DashboardLayout} />}>
        <Route path="dashboard" element={<DashboardStats />} />
        <Route path="appointments" element={<DailySlotView/>} />
        <Route path="slots" element={ <SlotGeneration/>} />
        <Route path="profile" element={<DoctorProfile/>} />
        <Route path="settings" element={<div>Settings Page</div>} />
        <Route path='bookedappointments' element={<AppointmentManagement appointments={appointments} userType='doctor'  />} />
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

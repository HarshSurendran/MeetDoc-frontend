import React from 'react';
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

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute component={LoginPage} />} />
      <Route path="/signup" element={<PublicRoute component={SignupPage} />} />
      <Route path="/otp" element={<PublicRoute component={OtpPage} />} />
      <Route element={<PrivateRoute component={UserDashboardLayout} />}>
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="profile" element={<UserProfilePage />} />
        
        
      
      </Route>
      <Route path='*' element={<UserErrorPage/>} />
    </Routes>
  );
};

export default UserRouter;

import React from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "../hocs/users/PublicRoute";
import LoginPage from "../Pages/user/LoginPage";
import HomePage from "../Pages/HomePage";
import PrivateRoute from "../hocs/users/PrivateRoute";
import Dashboard from "../Pages/user/Dashboard";
import SignupPage from "../Pages/user/SignupPage";
import OtpPage from "../Pages/user/OtpPage";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute component={LoginPage} />} />
      <Route path="/signup" element={<PublicRoute component={SignupPage} />} />
      <Route path="/otp" element={<PublicRoute component={OtpPage }/>}/>
      <Route
        path="/dashboard"
        element={<PrivateRoute component={Dashboard} />}
      />
    </Routes>
  );
};

export default UserRouter;

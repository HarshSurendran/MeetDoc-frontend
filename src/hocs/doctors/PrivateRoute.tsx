import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/appStore';
import { Navigate } from 'react-router-dom';
import { lazy } from 'react';

const DoctorVerificaiton = lazy(() => import('@/Pages/doctor/DoctorVerificaiton'));

interface PrivateRoute {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRoute> = ({ component: Component }) => {
  const doctorData = useSelector((state: RootState) => state.doctor);
  const isVerified = doctorData.doctor.isVerified;
  const isAuthenticated = doctorData.isAuthenticated;
  return isAuthenticated ? (
    isVerified ? (
      <Component />
    ) : (
        <DoctorVerificaiton />
    )
  ) : (
    <Navigate to={'/doctor/login'} />
  );
};

export default PrivateRoute;

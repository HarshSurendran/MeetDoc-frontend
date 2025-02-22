import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/appStore';
import { Navigate } from 'react-router-dom';

interface PublicRoute {
  component: React.ComponentType;
}

const PublicRoute: React.FC<PublicRoute> = ({ component: Component }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.doctor.isAuthenticated
  );
  return isAuthenticated ? <Navigate to={'/doctor/dashboard'} /> : <Component />;
};

export default PublicRoute;

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/appStore';
import { Navigate } from 'react-router-dom';

interface PublicRoute {
  component: React.ComponentType;
}

const PublicRoute: React.FC<PublicRoute> = ({ component: Component }) => {
  const admin = useSelector((state: RootState) => state.admin.admin);
  console.log(admin, 'From public roots');
  return admin._id ? <Navigate to={'/admin/dashboard'} /> : <Component />;
};

export default PublicRoute;

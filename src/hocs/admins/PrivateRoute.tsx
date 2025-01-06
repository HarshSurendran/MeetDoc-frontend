import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/appStore';
import { Navigate } from 'react-router-dom';

interface PrivateRoute {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRoute> = ({ component: Component }) => {
  const admin = useSelector((state: RootState) => state.admin.admin);
  console.log(admin._id, 'From private route');
  return admin._id ? <Component /> : <Navigate to={'/admin/login'} />;
};

export default PrivateRoute;

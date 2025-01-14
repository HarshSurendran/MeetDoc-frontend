import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/appStore';
import { Navigate } from 'react-router-dom';

interface PaymentRoute {
  component: React.ComponentType;
}

const PaymentRoute: React.FC<PaymentRoute> = ({ component: Component }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
    );
    const payment = useSelector((state: RootState) => state.payment.payment);
    
  return isAuthenticated ? (payment.fee > 0 ? <Component /> : <Navigate to={'/'}/>) : <Navigate to={'/login'} />;
};

export default PaymentRoute;

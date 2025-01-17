import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
} from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { createPaymentIntent, updateSlot } from '@/services/user/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import errorHandler from '@/utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import { resetPayment } from '@/redux/slices/paymentSlice';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PKEY);


export interface PaymentPageProps {
  clientSecret: string;
  appointmentDetails: {
    doctorName: string;
    specialisation: string;
    appointmentDate: Date;
    startTime: Date;
    endTime: Date;
    fee: number;
  };
  onBack: () => void;
}


const PaymentPage: React.FC = () => {
    const [clientSecret, setClientSecret] = useState("");
    const paymentDetails = useSelector((state: RootState) => state.payment.payment);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    useEffect(() => {
        block();
        getClientSecret();
    }, []);

    const block = async () => {
        try {
            await updateSlot(paymentDetails.slotId, {status:"Pending", pendingBookingExpiry:  new Date(Date.now() + 15 * 60 * 1000)});
        } catch (error) {
            errorHandler(error);
        }
    }

    const unblock = async () => {
        try {
            await updateSlot(paymentDetails.slotId, {status: "Available", pendingBookingExpiry: null });            
        } catch (error) {
            errorHandler(error);            
        }
    }

    const getClientSecret = async () => {
        try {
            const response = await createPaymentIntent(paymentDetails.slotId, paymentDetails.userId, paymentDetails.doctorId, paymentDetails.fee, paymentDetails.reason, new Date());
            console.log("Recieved Clietn secret", response);
            if (response.data) {
                setClientSecret(response.data.clientSecret);
            }
        } catch (error) {
            errorHandler(error);
        }
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as "stripe",
            variables: {
                colorPrimary: '#2563eb',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorDanger: '#dc2626',
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                borderRadius: '0.5rem',
            },
        },
    };
    
    const onBack = () => {
        unblock();
        dispatch(resetPayment());
        navigate(`/doctordetail/${paymentDetails.doctorId}`)
    }

    return (
        <>
            {clientSecret.length == 0 ? <p>Loading</p> : <Elements stripe={stripePromise} options={options}>
                <PaymentForm
                    onBack={onBack}
                />
            </Elements >}
        </>
    );
};

export default PaymentPage;
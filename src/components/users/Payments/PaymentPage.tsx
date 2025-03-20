import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
} from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { checkSlotStatus, createPaymentIntent, updateSlot } from '@/services/user/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import errorHandler from '@/utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import { resetPayment} from '@/redux/slices/paymentSlice';
import LoadingAnimation from '@/Pages/LoadingAnimation';
import toast from 'react-hot-toast';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PKEY);


const PaymentPage: React.FC = () => {
    const [clientSecret, setClientSecret] = useState("");
    const paymentDetails = useSelector((state: RootState) => state.payment.payment);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    useEffect(() => {
        checkSlotAvailability();
        block();
        getClientSecret();
    }, []);

    const checkSlotAvailability = async () => {
        try {
            const response = await checkSlotStatus(paymentDetails.slotId);
            if (response.status) {
                if (response.data.status == "Pending") {
                    toast.error("Sorry! This slot is being booked by someone else.");
                    navigate(-1);
                } else if (response.data.status == "Booked") {
                    toast.error("Sorry! This slot is already booked.");
                    navigate(-1);
                }
            }
        } catch (error) {
            errorHandler(error);
        }
    }

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
            const response = await createPaymentIntent(paymentDetails.slotId, paymentDetails.userId, paymentDetails.doctorId, paymentDetails.fee, paymentDetails.reason, paymentDetails.appointmentFor, paymentDetails.appointmentForName, new Date());
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
            {clientSecret.length == 0 ? <LoadingAnimation /> : <Elements stripe={stripePromise} options={options}>
                <PaymentForm
                    onBack={onBack}
                />
            </Elements >}
        </>
    );
};

export default PaymentPage;
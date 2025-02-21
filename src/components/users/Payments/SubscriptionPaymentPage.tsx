import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
} from '@stripe/react-stripe-js';
import { createSubscriptionPaymentIntent, getSubscriptionDetails } from '@/services/user/user';
import errorHandler from '@/utils/errorHandler';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import SubscriptionPaymentForm from './SubscriptionPaymentForm';
import { ISubscriptionScheme } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/appStore';
import LoadingAnimation from '@/Pages/LoadingAnimation';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PKEY);


const SubscriptionPaymentPage: React.FC = () => {
    const [clientSecret, setClientSecret] = useState("");
    const subId: string | undefined = useParams().subId;
    const [subscription, setSubscription] = useState<ISubscriptionScheme>();
    const userId = useSelector((state: RootState) => state.user.user._id);
    // const paymentDetails = useSelector((state: RootState) => state.payment.payment);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!subId) navigate(-1);
        fetchSubscriptionDetails(subId as string);
        getClientSecret();
    }, []);   

    const fetchSubscriptionDetails = async (sub: string) => {
        try {
            const response = await getSubscriptionDetails(sub);
            if (response.status) {
                setSubscription(response.data.scheme)
            } else {
                toast.error('Error fetching subscription details.');
                navigate(-1);
            }
        } catch (error) {
            errorHandler(error);
        }
    }

    const getClientSecret = async () => {
        try {
            if (!subId) {
                toast.error('Subscription Id not found. Try again');
                navigate(-1);
                return;
            }
            const response = await createSubscriptionPaymentIntent({ subId, userId, fee: subscription?.price||1000, duration: subscription?.duration||6, date: new Date()});
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
        navigate(-1);
    }

    return (
        <>
            {clientSecret.length == 0 ? <LoadingAnimation /> : <Elements stripe={stripePromise} options={options}>
                <SubscriptionPaymentForm
                    onBack={onBack}
                    price={subscription?.price||1000}
                />
            </Elements >}
        </>
    );
};

export default SubscriptionPaymentPage;
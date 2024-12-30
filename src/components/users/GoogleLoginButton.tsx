import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { sendGoogleToken } from '@/services/user/userAuth';
import errorHandler from '@/utils/errorHandler';
import { useDispatch } from 'react-redux';
import { addUser } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cId = import.meta.env.VITE_GOOGLE_CLIENTID;

    const handleSuccess = async (credentialResponse: any) => {
        try {
            console.log('Google Login Success:', credentialResponse);
            const response = await sendGoogleToken(credentialResponse);
            console.log("this is reposne form google signin--------------------------- ", response);
            if (response) {
                dispatch(addUser(response.data.user));
                localStorage.setItem("accessToken", response.data.accessToken);
                navigate("/user");
            }
        } catch (error) {
            errorHandler(error);
        }
    };
    
      const handleError = () => {
        console.log('Google Login Failed');
      };
    
      return (
        <GoogleOAuthProvider clientId={cId}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </GoogleOAuthProvider>
      );
};

export default GoogleLoginButton;

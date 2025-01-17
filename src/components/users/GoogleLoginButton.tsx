import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { sendGoogleToken } from '@/services/user/userAuth';
import errorHandler from '@/utils/errorHandler';
import { useDispatch } from 'react-redux';
import { addPhoto, addUser, toggleAuthentication } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { getProfilePhoto } from '@/services/user/user';

const GoogleLoginButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cId = import.meta.env.VITE_GOOGLE_CLIENTID;

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const response = await sendGoogleToken(credentialResponse);
            
            if (response) {
              dispatch(addUser(response.data.user));
              dispatch(toggleAuthentication(true));
              localStorage.setItem("userAccessToken", response.data.accessToken);
              if (response.data.user?.photo) {
                const url = await getProfilePhoto(response.data.user.photo);
                dispatch(addPhoto(url));
              }
              navigate("/");
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

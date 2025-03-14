import React, { useState } from 'react';
import errorHandler from '../../utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  validateEmail,
  validatePassword,
} from '../../utils/userValidator/uservalidator';
import { login } from '../../services/doctor/doctorAuth';
import { useDispatch } from 'react-redux';
import { addDoctor } from '../../redux/slices/doctorSlice';
import { Link } from 'react-router-dom';
import { getPhotoUrl } from '@/services/doctor/doctor';
import { Ilogin } from '@/types';
import { Button } from '@/components/ui/button';


const LoginPage = () => {
  const [formData, setFormData] = useState<Ilogin>({
    email: '',
    password: '',
  });

  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = (): Boolean => {
    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setEmailError(emailError);
      return false;
    }
    // Password validation
    const passError = validatePassword(formData?.password as string);
    if (passError) {
      setPassError(passError);
      return false;
    }
    setPassError('');
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        
        const response = await login(formData as {email: string, password: string});

        if (response) {
          localStorage.setItem(
            'doctorAccessToken',
            response.data.doctorAccessToken
          );
          if (response.data.docData.photo) {
            const url = await getPhotoUrl(response.data.docData.photo);
            console.log(url);
            response.data.docData.photo = url;
            console.log("Response after updating photo url")
          }
          dispatch(addDoctor(response.data.docData));
          toast.success('Logged in successfully');
          navigate('/doctor/dashboard');
        }
        
      } catch (error) {
        errorHandler(error);
        console.error('Login error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'email') {
      setEmailError('');
    } else {
      setPassError('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome Doctor, please login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We value your hardwork!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    passError ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {passError && (
                  <p className="mt-1 text-sm text-red-600">{passError}</p>
                )}
              </div>
            
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm text-gray-500"
                  onClick={() => navigate('/doctor/forgot-password')}
                >
                  Forgot password?
                </Button>
            </div>

           
              

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loging in...' : 'Log in'}
              </button>
            </div>
          </form>

          {/* Signup Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500">
                  Don't have an account?{' '}
                  <Link
                    to="/doctor/signup"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

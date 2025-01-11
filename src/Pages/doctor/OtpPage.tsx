import {
  useState,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
  useEffect,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import errorHandler from '../../utils/errorHandler';
import { useDispatch } from 'react-redux';
import { addDoctor } from '../../redux/slices/doctorSlice';
import { verifyOtp } from '../../services/doctor/doctorAuth';

const OtpPage = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = location.state;

  // Create refs for each input
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (inputRefs.current.length !== 6) {
    inputRefs.current = Array(6).fill(null);
  }

  useEffect(() => {
    if (!formData) {
      navigate('/signup');
    }
    startTimer();
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  const startTimer = () => {
    setIsActive(true);
    setTimer(60);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    timerInterval.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          if (timerInterval.current) {
            clearInterval(timerInterval.current);
          }
          setIsActive(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;

    if (!value.match(/^[0-9]$/)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (index < 5 && value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);

    if (!pastedData.match(/^[0-9]+$/)) {
      setError('Please paste numbers only');
      return;
    }

    const pastedArray = pastedData.split('').slice(0, 6);
    const newOtp = [...otp];

    pastedArray.forEach((value, index) => {
      newOtp[index] = value;
    });

    setOtp(newOtp);
    setError('');

    const nextEmptyIndex = newOtp.findIndex((value) => !value);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (otp.some((digit) => !digit)) {
      setError('Please enter all digits');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting OTP:', otp.join(''));
      const response = await verifyOtp(otp.join(''), formData);
      if (response) {
        console.log(response, 'This is the reponse form otp');
        dispatch(addDoctor(response.data.doctor));
        localStorage.setItem(
          'doctorAccessToken',
          response?.data.doctorAccessToken
        );
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      setError('Failed to verify OTP');
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (!isActive) {
      console.log('Resending OTP');
      startTimer();
    }
  };

  const progressPercentage = (timer / 60) * 100;
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the 6-digit code sent to your device
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* OTP Input Group */}
            <div>
              <div className="flex justify-center gap-2 sm:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 text-center text-2xl font-semibold border ${
                      error && !digit ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  />
                ))}
              </div>
              {error && (
                <p className="mt-2 text-center text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                onClick={handleSubmit}
                disabled={loading || otp.some((digit) => !digit)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            {/* Resend OTP with Timer */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="4"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                  {timer}s
                </div>
              </div>
              <button
                onClick={handleResend}
                disabled={isActive}
                className={`text-sm font-medium ${
                  isActive
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:text-blue-500'
                } focus:outline-none`}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import GoogleLoginButton from '@/components/users/GoogleLoginButton';
import { register } from '@/services/user/userAuth';
import errorHandler from '@/utils/errorHandler';
import toast from 'react-hot-toast';
import { validateEmail, validateFullName, validatePassword, validatePhone } from '@/utils/userValidator/uservalidator';

interface FormData {
  name: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  gender?: string;
  phone?: string;
}

const SignupPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    gender: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors: FormErrors  = {}   
    const nameError = validateFullName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }
   
    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError;
    };

    const passError = validatePassword(formData.password);
    if (passError) {
      newErrors.password = passError;
    };

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
          setLoading(true);
          try {
            const response = await register(formData);
            if (response?.data.mailSent) {
              toast.success('Otp has been sent to your email');
              navigate('/otp', { state: formData });
            }
          } catch (error) {
            errorHandler(error);
            console.error('Signup error:', error);
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
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
          setErrors((prev) => ({
            ...prev,
            [name]: undefined,
          }));
        }
      };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
    {/* Left Section - Illustration */}
    <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center p-8">
      <div className="max-w-md text-white space-y-8">
        <svg
          className="w-full h-auto"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
         <rect width="400" height="300" fill="none"/>
            <circle cx="200" cy="150" r="100" fill="white" fillOpacity="0.1"/>
            <path d="M150 150 C150 100, 250 100, 250 150" stroke="white" strokeWidth="4"/>
            <circle cx="160" cy="120" r="15" fill="white"/>
            <circle cx="240" cy="120" r="15" fill="white"/>
        </svg>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Join MeetDoc</h2>
          <p className="text-blue-100">
            Create an account to connect with certified doctors and get reliable medical consultations
          </p>
        </div>
      </div>
    </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Create Account</h1>
            <p className="text-gray-600">Start your healthcare journey with MeetDoc</p>
          </div>

          <div className="space-y-4">
            <GoogleLoginButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or register with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  name="name"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  name="phone"
                  placeholder="Enter your phone number"
                  className="pl-10"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <Select
                name="gender"
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Button type="button" variant="link" onClick={() => navigate('/login')} className="text-blue-600">
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

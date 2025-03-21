import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock } from "lucide-react";
import toast from 'react-hot-toast';
import { login } from '@/services/user/userAuth';
import { useDispatch } from 'react-redux';
import { toggleAuthentication, addPhoto, addUser } from '@/redux/slices/userSlice';
import { getProfilePhoto } from '@/services/user/user';
import errorHandler from '@/utils/errorHandler';
import GoogleLoginButton from '@/components/users/GoogleLoginButton';


const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage : React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      
      const response = await login(values);
      if (response?.status) {
        toast.success('logged in successfully');
        dispatch(addUser(response.data.user));
        dispatch(toggleAuthentication(true));
        if (response.data.accessToken) {
          localStorage.setItem('userAccessToken', response.data.accessToken);
        }
        if (response.data.user?.photo) {
          const url = await getProfilePhoto(response.data.user.photo);
          dispatch(addPhoto(url));
        }
        navigate('/');
      }
    } catch (error) {
      console.log(error, 'Error from login page');
      errorHandler(error);
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
            {/* Simple doctor consultation illustration */}
            <rect width="400" height="300" fill="none"/>
            <circle cx="200" cy="150" r="100" fill="white" fillOpacity="0.1"/>
            <path d="M150 150 C150 100, 250 100, 250 150" stroke="white" strokeWidth="4"/>
            <circle cx="160" cy="120" r="15" fill="white"/>
            <circle cx="240" cy="120" r="15" fill="white"/>
          </svg>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Welcome to MeetDoc</h2>
            <p className="text-blue-100">
              Connect with certified doctors online for quick and reliable medical consultations
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center ">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">MeetDoc</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-4 ">
            <div className="w-full mx-auto">
              <GoogleLoginButton />
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="you@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-blue-600"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600"
                  onClick={() => navigate('/signup')}
                >
                  Create account
                </Button>
              </div>
            </form>
          </Form>

          {/* Social Proof */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">Trusted by thousands of patients</p>
            <div className="mt-4 flex justify-center space-x-4">
              {/* Add trust indicators or partner logos here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
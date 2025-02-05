import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { forgotPassword } from '@/services/user/userAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response.status) {
        setIsSuccess(true);
        setMessage(response.data.message);
      } else {
        setIsSuccess(false);
        setMessage('Error sending reset link. Please try again.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="block w-full"
                disabled={isLoading }
              />
            </div>
            {message && (
              <Alert className={isSuccess ? "bg-green-50" : "bg-red-50"}>
                <AlertDescription className={isSuccess ? "text-green-800" : "text-red-800"}>
                  {message}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
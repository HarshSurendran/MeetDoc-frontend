import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '@/services/user/userAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validatePassword } from '@/utils/userValidator/uservalidator';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      setIsSuccess(false);
      return;
    }

    const passError = validatePassword(newPassword);
    if (passError) {
        setMessage(passError);
        setIsSuccess(false);
        return;
    };

    setIsLoading(true);
    try {
      if (!token) {
        setMessage('Invalid or missing reset token');
        setIsSuccess(false);
        return;
      }
      
      const response = await resetPassword(token, newPassword);
      if (response.status) {
        setIsSuccess(true);
        setMessage(response.data.message || 'Password reset successful! You can now login with your new password.');
      } else {
        setIsSuccess(false);
        setMessage('Error resetting password. The link may have expired or is invalid.');
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
              <KeyRound className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your new password below to reset your account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  required
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
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

export default ResetPasswordPage;
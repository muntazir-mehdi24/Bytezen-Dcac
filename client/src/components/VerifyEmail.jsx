import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // In a real app, you would verify the token with your backend
        // For now, we'll simulate a successful verification
        await authAPI.verifyEmail(token);
        
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Email verified successfully! You can now log in.' 
            } 
          });
        }, 3000);
        
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.error || 
          'Failed to verify email. The link may have expired or is invalid.'
        );
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [token, navigate]);

  const handleResendVerification = async () => {
    try {
      // In a real app, you would request a new verification email
      // await authAPI.resendVerificationEmail(email);
      
      setStatus('success');
      setMessage('A new verification email has been sent to your email address.');
    } catch (error) {
      console.error('Resend verification error:', error);
      setMessage(
        error.response?.data?.error || 
        'Failed to resend verification email. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {status === 'verifying' ? 'Verifying Email...' : 
             status === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </h2>
          
          <div className={`mt-4 p-4 rounded-md ${
            status === 'success' ? 'bg-green-50 text-green-800' : 
            status === 'error' ? 'bg-red-50 text-red-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            <p className="text-center">{message}</p>
          </div>
          
          {status === 'error' && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-4">
                Didn't receive the verification email or link expired?
              </p>
              <button
                onClick={handleResendVerification}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Resend Verification Email
              </button>
              
              <div className="mt-4 text-sm text-center">
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to Login
                </a>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="mt-6">
              <div className="flex justify-center">
                <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Redirecting you to the login page...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

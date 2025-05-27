import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetFormData, setResetFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const navigate = useNavigate();
  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/my-account');
    }

    // Load Google API
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        initGoogleButton();
      };
    };

    loadGoogleScript();
  }, [navigate]);

  const initGoogleButton = () => {
    if (window.google && document.getElementById('googleButton')) {
      window.google.accounts.id.initialize({
        client_id:
          '167746703028-j46ic8mc5mqh9alpurccj4i4aq9btm09.apps.googleusercontent.com', // Replace with your actual client ID
        callback: handleGoogleSignIn,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleButton'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  };

  const handleGoogleSignIn = async (response) => {
    try {
      setIsSubmitting(true);
      setError('');
      const token = response.credential;

      const result = await googleLogin(token);

      if (result.success) {
        // Check if user is admin to redirect to admin dashboard
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/my-account');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetFormData({
      ...resetFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'register') {
        // Validate password match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }

        // Register user
        const res = await axios.post(`${API_URL}/auth/register`, {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });

        if (res.data.success) {
          setSuccessMessage(res.data.message);
          setShowOtpForm(true);
          setActiveTab('login');
        }
      } else {
        // Login with auth context
        try {
          const result = await login(formData.email, formData.password);

          if (result.needsVerification) {
            setSuccessMessage('Please verify your email address.');
            setShowOtpForm(true);
          } else {
            // Get current user from local storage
            const userJSON = localStorage.getItem('user');
            if (userJSON) {
              const user = JSON.parse(userJSON);
              // Redirect based on role
              if (user.role === 'admin') {
                navigate('/admin');
              } else {
                navigate('/my-account');
              }
            }
          }
        } catch (error) {
          setError(error.message);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: formData.email,
        otp,
      });

      if (res.data.message) {
        setSuccessMessage(res.data.message);
        setShowOtpForm(false);
        // Clear form after a delay
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: forgotEmail,
      });

      if (res.data.message) {
        setSuccessMessage(res.data.message);
        setShowResetPassword(true);
        setShowForgotPassword(false);
        setResetFormData({ ...resetFormData, email: forgotEmail });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (resetFormData.newPassword !== resetFormData.confirmNewPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        email: resetFormData.email,
        otp: resetFormData.otp,
        newPassword: resetFormData.newPassword,
      });

      if (res.data.message) {
        setSuccessMessage(res.data.message);
        setShowResetPassword(false);
        // Clear form after a delay
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className='flex justify-center items-center min-h-[70vh] px-4'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>
              Forgot Password
            </h2>

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}

            {successMessage && (
              <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className='space-y-4'>
              <div>
                <label className='block text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                />
              </div>

              <button
                type='submit'
                className='w-full bg-black text-white py-2 rounded-md hover:bg-opacity-80 transition-colors duration-300'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset OTP'}
              </button>

              <div className='text-center mt-4'>
                <button
                  type='button'
                  onClick={() => setShowForgotPassword(false)}
                  className='text-gray-600 hover:underline'
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (showResetPassword) {
    return (
      <div className='flex justify-center items-center min-h-[70vh] px-4'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>
              Reset Password
            </h2>

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}

            {successMessage && (
              <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleResetPassword} className='space-y-4'>
              <div>
                <label className='block text-gray-700 mb-2'>OTP</label>
                <input
                  type='text'
                  name='otp'
                  value={resetFormData.otp}
                  onChange={handleResetChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                />
              </div>

              <div>
                <label className='block text-gray-700 mb-2'>New Password</label>
                <input
                  type='password'
                  name='newPassword'
                  value={resetFormData.newPassword}
                  onChange={handleResetChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                />
              </div>

              <div>
                <label className='block text-gray-700 mb-2'>
                  Confirm New Password
                </label>
                <input
                  type='password'
                  name='confirmNewPassword'
                  value={resetFormData.confirmNewPassword}
                  onChange={handleResetChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                />
              </div>

              <button
                type='submit'
                className='w-full bg-black text-white py-2 rounded-md hover:bg-opacity-80 transition-colors duration-300'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className='text-center mt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetFormData({
                      email: '',
                      otp: '',
                      newPassword: '',
                      confirmNewPassword: '',
                    });
                  }}
                  className='text-gray-600 hover:underline'
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // OTP Verification Form
  if (showOtpForm) {
    return (
      <div className='flex justify-center items-center min-h-[70vh] px-4'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>
              Verify Email
            </h2>

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}

            {successMessage && (
              <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className='space-y-4'>
              <p className='text-gray-600 mb-4'>
                Please enter the verification code sent to your email.
              </p>

              <div>
                <label className='block text-gray-700 mb-2'>OTP Code</label>
                <input
                  type='text'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                />
              </div>

              <button
                type='submit'
                className='w-full bg-black text-white py-2 rounded-md hover:bg-opacity-80 transition-colors duration-300'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className='text-center mt-4'>
                <button
                  type='button'
                  onClick={() => setShowOtpForm(false)}
                  className='text-gray-600 hover:underline'
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center min-h-[70vh] px-4 my-20'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-md p-8'>
          {/* Tab Selector */}
          <div className='flex mb-8 border-b'>
            <button
              className={`flex-1 py-2 font-medium ${
                activeTab === 'login'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 font-medium ${
                activeTab === 'register'
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
              {error}
            </div>
          )}

          {successMessage && (
            <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            {activeTab === 'register' && (
              <div>
                <label className='block text-gray-700 mb-2'>Full Name</label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required={activeTab === 'register'}
                />
              </div>
            )}

            <div>
              <label className='block text-gray-700 mb-2'>Email Address</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-2'>Password</label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            {activeTab === 'register' && (
              <div>
                <label className='block text-gray-700 mb-2'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required={activeTab === 'register'}
                />
              </div>
            )}

            {activeTab === 'login' && (
              <div className='text-right'>
                <button
                  type='button'
                  onClick={() => setShowForgotPassword(true)}
                  className='text-sm text-gray-600 hover:text-black'
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type='submit'
              className='w-full bg-black text-white py-2 rounded-md hover:bg-opacity-80 transition-colors duration-300'
              disabled={isSubmitting}
            >
              {isSubmitting
                ? activeTab === 'login'
                  ? 'Logging in...'
                  : 'Registering...'
                : activeTab === 'login'
                ? 'Login'
                : 'Register'}
            </button>
          </form>

          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='mb-4'>
            <div id='googleButton' className='flex justify-center'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

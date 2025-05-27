import React, { useState, useEffect } from 'react';
import { FaUser, FaGoogle } from 'react-icons/fa';
import axios from 'axios';

const Security = () => {
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'google'
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Determine login method from stored user data
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.googleId) {
      setLoginMethod('google');
    } else {
      setLoginMethod('password');
    }
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirm password don't match");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authorized. Please log in again.');
      }

      const response = await axios.put(
        'http://localhost:8000/api/profile/password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage('Password updated successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'An error occurred while updating password'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-6'>Security Settings</h2>

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

      <div className='mb-8'>
        <h3 className='text-lg font-medium mb-4'>Login Method</h3>
        <div className='p-4 bg-gray-50 rounded-lg'>
          {loginMethod === 'password' ? (
            <div>
              <p className='flex items-center'>
                <span className='w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3'>
                  <FaUser className='text-white' />
                </span>
                <span>Email and Password</span>
              </p>
              <p className='text-sm text-gray-500 mt-2 ml-11'>
                You're using email and password to sign in to your account.
              </p>
            </div>
          ) : (
            <div>
              <p className='flex items-center'>
                <span className='w-8 h-8 bg-white border rounded-full flex items-center justify-center mr-3'>
                  <FaGoogle className='text-red-500' />
                </span>
                <span>Google Account</span>
              </p>
              <p className='text-sm text-gray-500 mt-2 ml-11'>
                You're using your Google account to sign in. No password is
                required.
              </p>
            </div>
          )}
        </div>
      </div>

      {loginMethod === 'password' && (
        <div>
          <h3 className='text-lg font-medium mb-4'>Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className='space-y-4'>
            <div>
              <label className='block text-gray-700 mb-2'>
                Current Password
              </label>
              <input
                type='password'
                name='currentPassword'
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-2'>New Password</label>
              <input
                type='password'
                name='newPassword'
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
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
                name='confirmPassword'
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <button
              type='submit'
              className='bg-black text-white py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors duration-300'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {loginMethod === 'google' && (
        <div className='p-4 border border-gray-200 rounded-lg'>
          <p className='text-gray-600'>
            You're currently using Google to sign in to your account. If you'd
            like to use a password instead, you can disconnect your Google
            account and set up a password.
          </p>
          <button className='mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'>
            Switch to Email/Password Login
          </button>
        </div>
      )}

      <div className='mt-8 border-t pt-6'>
        <h3 className='text-lg font-medium mb-4 text-red-600'>
          Account Actions
        </h3>
        <button
          onClick={() => {
            if (
              window.confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
              )
            ) {
              // Handle account deletion
              alert('Account deletion would be processed here');
            }
          }}
          className='px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50'
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Security;

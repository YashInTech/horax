import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthdate: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch user profile from API or use localStorage data
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setProfile({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        birthdate: user.birthdate || '',
      });
    }
    setIsLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authorized. Please log in again.');
      }

      const response = await axios.put(
        'http://localhost:8000/api/profile',
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage('Profile updated successfully');
        // Update localStorage with new data
        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user')),
          ...profile,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'An error occurred while updating profile'
      );
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-pulse flex space-x-2'>
          <div className='h-3 w-3 bg-black rounded-full'></div>
          <div className='h-3 w-3 bg-black rounded-full'></div>
          <div className='h-3 w-3 bg-black rounded-full'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-6'>My Profile</h2>

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

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label htmlFor='fullName' className='block text-gray-700 mb-2'>
              Full Name
            </label>
            <input
              type='text'
              id='fullName'
              name='fullName'
              value={profile.fullName}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
            />
          </div>

          <div>
            <label htmlFor='email' className='block text-gray-700 mb-2'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={profile.email}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-gray-100'
              disabled
            />
            <p className='text-xs text-gray-500 mt-1'>
              Email cannot be changed
            </p>
          </div>

          <div>
            <label htmlFor='phone' className='block text-gray-700 mb-2'>
              Phone Number
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={profile.phone}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
            />
          </div>

          <div>
            <label htmlFor='birthdate' className='block text-gray-700 mb-2'>
              Birthdate
            </label>
            <input
              type='date'
              id='birthdate'
              name='birthdate'
              value={profile.birthdate}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
            />
          </div>
        </div>
        <button
          type='submit'
          className='bg-black text-white py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors duration-300'
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;

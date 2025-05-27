import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to='/login' replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminRoute;

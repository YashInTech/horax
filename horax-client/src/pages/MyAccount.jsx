import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';

// Use lazy loading for better performance
const Profile = lazy(() => import('../components/UserAccount/Profile'));
const Orders = lazy(() => import('../components/UserAccount/Orders'));
const Addresses = lazy(() => import('../components/UserAccount/Addresses'));
const OrderHistory = lazy(() =>
  import('../components/UserAccount/OrderHistory')
);
const Security = lazy(() => import('../components/UserAccount/Security'));

// Loading component for Suspense fallback
const LoadingComponent = () => (
  <div className='flex justify-center items-center p-8'>
    <div className='animate-pulse flex space-x-2'>
      <div className='h-3 w-3 bg-[#b6ff00] rounded-full'></div>
      <div className='h-3 w-3 bg-[#b6ff00] rounded-full'></div>
      <div className='h-3 w-3 bg-[#b6ff00] rounded-full'></div>
    </div>
  </div>
);

const MyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If user is at /my-account, redirect to /my-account/profile
  useEffect(() => {
    if (location.pathname === '/my-account') {
      navigate('/my-account/profile');
    }
  }, [location.pathname, navigate]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Sidebar */}
        <div className='lg:w-1/4'>
          <UserSidebar />
        </div>

        {/* Main Content */}
        <div className='lg:w-3/4'>
          <div className='bg-white p-6 rounded-lg shadow-md min-h-[70vh]'>
            <Suspense fallback={<LoadingComponent />}>
              <Routes>
                <Route path='/profile' element={<Profile />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/addresses' element={<Addresses />} />
                <Route path='/order-history' element={<OrderHistory />} />
                <Route path='/security' element={<Security />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;

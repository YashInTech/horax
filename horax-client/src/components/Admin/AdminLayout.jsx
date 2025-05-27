import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaChartBar,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaSignOutAlt,
  FaBars,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-800' : '';
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-64 fixed z-10 inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className='flex items-center justify-between p-4 border-b border-gray-700'>
          <div className='flex items-center'>
            <h2 className='text-xl font-bold'>Horax Admin</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='md:hidden'
          >
            <FaBars />
          </button>
        </div>

        <nav className='mt-6'>
          <Link
            to='/admin'
            className={`flex items-center px-6 py-3 hover:bg-gray-800 ${isActive(
              '/admin'
            )}`}
          >
            <FaChartBar className='mr-3' />
            <span>Dashboard</span>
          </Link>
          <Link
            to='/admin/products'
            className={`flex items-center px-6 py-3 hover:bg-gray-800 ${isActive(
              '/admin/products'
            )}`}
          >
            <FaBox className='mr-3' />
            <span>Products</span>
          </Link>
          <Link
            to='/admin/orders'
            className={`flex items-center px-6 py-3 hover:bg-gray-800 ${isActive(
              '/admin/orders'
            )}`}
          >
            <FaShoppingBag className='mr-3' />
            <span>Orders</span>
          </Link>
          <Link
            to='/admin/users'
            className={`flex items-center px-6 py-3 hover:bg-gray-800 ${isActive(
              '/admin/users'
            )}`}
          >
            <FaUsers className='mr-3' />
            <span>Users</span>
          </Link>
        </nav>

        <div className='absolute bottom-0 left-0 w-full p-4 border-t border-gray-700'>
          <div className='flex items-center mb-4'>
            <div className='w-8 h-8 bg-white rounded-full overflow-hidden mr-3'>
              {currentUser?.profileImg ? (
                <img
                  src={currentUser.profileImg}
                  alt={currentUser.fullName}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-gray-300 flex items-center justify-center text-gray-700'>
                  {currentUser?.fullName?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            <div>
              <p className='text-sm font-medium'>{currentUser?.fullName}</p>
              <p className='text-xs text-gray-400'>{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center text-red-400 hover:text-red-300'
          >
            <FaSignOutAlt className='mr-2' />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Header */}
        <header className='bg-white shadow-sm z-10'>
          <div className='flex items-center justify-between p-4'>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='text-gray-600 md:hidden'
            >
              <FaBars />
            </button>
            <div className='text-lg font-medium'>
              {location.pathname === '/admin' && 'Dashboard'}
              {location.pathname === '/admin/products' && 'Product Management'}
              {location.pathname === '/admin/add-product' && 'Add Product'}
              {location.pathname.includes('/admin/edit-product/') &&
                'Edit Product'}
              {location.pathname === '/admin/orders' && 'Order Management'}
              {location.pathname === '/admin/users' && 'User Management'}
            </div>
            <div></div> {/* Placeholder for right side elements */}
          </div>
        </header>

        {/* Main content */}
        <main className='flex-1 overflow-y-auto bg-gray-50 p-4'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

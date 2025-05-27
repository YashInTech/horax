import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaCamera,
  FaShoppingBag,
  FaAddressCard,
  FaSignOutAlt,
  FaHistory,
  FaShieldAlt,
} from 'react-icons/fa';

const UserSidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => {
    return path.includes(route)
      ? 'bg-[#b6ff00] text-black'
      : 'hover:bg-gray-100';
  };

  const menuItems = [
    {
      name: 'My Profile',
      icon: <FaUser />,
      path: '/my-account/profile',
    },
    {
      name: 'My Orders',
      icon: <FaShoppingBag />,
      path: '/my-account/orders',
    },
    {
      name: 'Addresses',
      icon: <FaAddressCard />,
      path: '/my-account/addresses',
    },
    {
      name: 'Order History',
      icon: <FaHistory />,
      path: '/my-account/order-history',
    },
    {
      name: 'Security',
      icon: <FaShieldAlt />,
      path: '/my-account/security',
    },
  ];

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      {/* User Info Section */}
      <div className='p-6 bg-gray-50 border-b border-gray-200'>
        <div className='flex items-center'>
          <div className='h-16 w-16 rounded-full overflow-hidden border-2 border-[#b6ff00] flex-shrink-0'>
            <img
              src='/images/avatar-placeholder.jpg'
              alt='User Avatar'
              className='h-full w-full object-cover'
            />
          </div>
          <div className='ml-4'>
            <h3 className='font-semibold text-lg'>John Doe</h3>
            <p className='text-gray-500 text-sm'>john.doe@example.com</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className='p-2'>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className='mb-1'>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-all ${isActive(
                  item.path
                )}`}
              >
                <span className='text-lg mr-3'>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}

          {/* Logout Button */}
          <li className='mt-6 px-2'>
            <button
              onClick={() => {
                // Add logout functionality here
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className='flex items-center w-full px-4 py-3 rounded-md text-red-600 hover:bg-red-50 transition-all'
            >
              <span className='text-lg mr-3'>
                <FaSignOutAlt />
              </span>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserSidebar;

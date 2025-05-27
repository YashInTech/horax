import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className='flex items-center justify-between py-5 font-medium px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-[#141414] text-white'>
      <ul className='hidden sm:flex gap-5 text-sm text-white'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-white hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-white hidden' />
        </NavLink>
        <NavLink to='/about-us' className='flex flex-col items-center gap-1'>
          <p>ABOUT US</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-white hidden' />
        </NavLink>
        <NavLink
          to='/get-in-touch'
          className='flex flex-col items-center gap-1'
        >
          <p>GET IN TOUCH</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-white hidden' />
        </NavLink>
      </ul>
      {/* <img src={assets.logo} className='w-36' alt='HoraxLogo' /> */}
      <div className='flex items-center gap-6'>
        <img src={assets.search_icon} className='w-5 cursor-pointer' alt='' />
        <Link to='my-account' className='group relative'>
          <img
            src={assets.profile_icon}
            className='w-5 cursor-pointer'
            alt='My Account'
          />
        </Link>
        <Link to='cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt='' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-white text-[#141414] aspect-square rounded-full text-[8px] '></p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt=''
        />
      </div>

      {/* Sidebar Menu for Small Screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-[#141414] text-white transition-all ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className='flex flex-col text-white'>
          <div
            onClick={() => setVisible(false)}
            className='flex items-center gap-4 p-3'
          >
            <img src={assets.dropdown_icon} className='h-4 rotate-180' alt='' />
            <p>Back</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

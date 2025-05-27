import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className='bg-[#141414] text-white py-10'>
      <div className='container mx-auto px-4'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {/* Column 1: About */}
          <div>
            <h3 className='text-xl font-bold mb-6 relative'>
              About Horax
              <span className='absolute bottom-0 left-0 w-12 h-1 bg-white -mb-2'></span>
            </h3>
            <p className='text-gray-300 mb-4'>
              Horax offers high-quality products that enhance everyday life.
              We're committed to excellence, sustainability, and exceptional
              customer service.
            </p>
            <div className='flex space-x-4 mt-6'>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-300'
              >
                <FaFacebookF />
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-300'
              >
                <FaXTwitter />
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-300'
              >
                <FaInstagram />
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-300'
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className='text-xl font-bold mb-6 relative'>
              Quick Links
              <span className='absolute bottom-0 left-0 w-12 h-1 bg-white -mb-2'></span>
            </h3>
            <ul className='space-y-3'>
              {['Home', 'About Us', 'Collection', 'Get In Touch'].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      to={
                        item === 'Home'
                          ? '/'
                          : `/${item.toLowerCase().replace(/\s+/g, '-')}`
                      }
                      className='text-gray-300 hover:text-white flex items-center transition-colors duration-300'
                    >
                      <FaArrowRight className='mr-2 text-xs text-white' />{' '}
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className='text-xl font-bold mb-6 relative'>
              Contact Info
              <span className='absolute bottom-0 left-0 w-12 h-1 bg-white -mb-2'></span>
            </h3>
            <ul className='space-y-4'>
              <li className='flex'>
                <FaMapMarkerAlt className='text-white text-xl mr-3 mt-1' />
                <span className='text-gray-300'>
                  NIT - Faridabad, Haryana, 121001, India
                </span>
              </li>
              <li className='flex'>
                <FaPhone className='text-white text-xl mr-3 mt-1' />
                <span className='text-gray-300'>+91 98765 43210</span>
              </li>
              <li className='flex'>
                <FaEnvelope className='text-white text-xl mr-3 mt-1' />
                <span className='text-gray-300'>info@horax.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className='text-xl font-bold mb-6 relative'>
              Newsletter
              <span className='absolute bottom-0 left-0 w-12 h-1 bg-white -mb-2'></span>
            </h3>
            <p className='text-gray-300 mb-4'>
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className='mt-4'>
              <div className='relative'>
                <input
                  type='email'
                  placeholder='Your email address'
                  className='w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:border-white'
                  required
                />
                <button
                  type='submit'
                  className='absolute right-0 top-0 h-full bg-white text-black px-4 rounded-r hover:bg-opacity-90 transition-colors duration-300'
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-800 my-8'></div>

        {/* Bottom Footer */}
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-4 md:mb-0'>
            <img
              src='/images/logo-white.png'
              alt='Horax Logo'
              className='h-8'
            />
          </div>
          <div className='text-gray-400 text-sm'>
            © {new Date().getFullYear()} Horax. All Rights Reserved.
          </div>
          <div className='mt-4 md:mt-0'>
            <ul className='flex space-x-6'>
              <li>
                <a href='#' className='text-gray-400 hover:text-white text-sm'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white text-sm'>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white text-sm'>
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

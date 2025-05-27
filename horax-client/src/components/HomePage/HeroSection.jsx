import React from 'react';
import { Link } from 'react-router-dom';
import hero from '/hero-section.png';

const HeroSection = () => {
  return (
    <div className='relative'>
      <img
        src={hero}
        alt='Hero Section'
        className='w-full h-auto object-cover'
      />
      <div className='absolute top-84 left-36'>
        <Link
          to='/collection'
          className='bg-black hover:bg-[#141414] text-white text-xl font-bold py-4 px-8 rounded-full transition-colors duration-300 shadow-lg hover:scale-105 transform transition-transform'
        >
          Explore Our Collection
        </Link>
      </div>
      <div className='absolute top-84 left-112'>
        <Link
          to='/collection'
          className='bg-white hover:bg-white/90 text-black text-xl font-bold py-4 px-8 rounded-full transition-colors duration-300 shadow-lg hover:scale-105 transform transition-transform'
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;

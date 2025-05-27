import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsSection = () => {
  return (
    <div className='bg-white py-16'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row items-center gap-8'>
          {/* About Us Image */}
          <div className='md:w-1/2'>
            <div className='bg-gray-200 h-72 md:h-96 rounded-lg flex items-center justify-center relative overflow-hidden'>
              <span className='text-gray-400 text-xl'>About Us Image</span>
              {/* You can replace the above div with an actual image when available */}
              {/* <img 
                src="/images/about-us.jpg" 
                alt="About Horax" 
                className="w-full h-full object-cover" 
              /> */}
            </div>
          </div>

          {/* About Us Content */}
          <div className='md:w-1/2'>
            <h2 className='text-3xl font-bold mb-4'>About Horax</h2>
            <div className='w-16 h-1 bg-black mb-6'></div>
            <p className='text-gray-700 mb-6'>
              At Horax, we're passionate about combining style, comfort, and
              performance in every piece we create. Our journey began with a
              simple vision: to design premium athleisure wear that empowers you
              to look and feel your best, whether you're hitting the gym,
              running errands, or meeting friends.
            </p>
            <p className='text-gray-700 mb-8'>
              We're committed to quality craftsmanship, sustainable practices,
              and innovative designs that stand the test of time. Each Horax
              product is carefully crafted with attention to detail, using
              premium materials that ensure comfort and durability.
            </p>
            <Link
              to='/about-us'
              className='inline-block bg-black text-white font-semibold py-3 px-8 rounded hover:bg-opacity-80 transition-colors duration-300'
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;

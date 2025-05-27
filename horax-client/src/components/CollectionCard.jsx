import React from 'react';
import { Link } from 'react-router-dom';

const CollectionCard = ({
  category,
  height = 'h-[500px]',
  imageHeight = 'h-[400px]',
}) => {
  return (
    <div
      className={`overflow-hidden rounded-xl shadow-lg bg-white ${height} relative group transform transition-transform duration-300 hover:scale-[1.02]`}
    >
      {/* Category Image - Wrapped in Link */}
      <Link
        to={category.link}
        className={`block ${imageHeight} overflow-hidden`}
      >
        <div className='h-full w-full bg-gray-200 flex items-center justify-center'>
          <span className='text-4xl font-bold text-gray-400'>
            {category.name}
          </span>
          {/* Image will replace the text when added */}
          {/* <img
            src={category.imagePath}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          /> */}
        </div>
      </Link>

      {/* Hover Overlay with Centered Button - Covers entire card with reduced opacity */}
      <div className='absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center pointer-events-none'>
        {/* This div is just for the overlay effect, pointer-events-none prevents it from blocking clicks */}
      </div>

      {/* Button Container - Separate from overlay to maintain button appearance */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300'>
        <Link
          to={category.link}
          className='transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 bg-[#141414] text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-black hover:text-black border-2 border-[#141414] shadow-lg z-10'
        >
          Shop Now
        </Link>
      </div>

      {/* Category Info with Fixed Height - No button */}
      <div
        className='absolute bottom-0 left-0 right-0 bg-white'
        style={{ height: '130px' }}
      >
        <div className='p-6'>
          <h3 className='text-2xl font-bold mb-2'>{category.name}</h3>

          {/* Fixed height description container */}
          <div className='h-12'>
            <p className='text-gray-600 line-clamp-2'>{category.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;

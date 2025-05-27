import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CollectionCard from '../CollectionCard';
import { categories } from '../../data/categoriesData';

const CollectionCarousel = () => {
  const carouselRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollInterval;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (
          carousel.scrollLeft + carousel.clientWidth >=
          carousel.scrollWidth
        ) {
          // If we've reached the end, go back to the beginning
          carousel.scrollLeft = 0;
        } else {
          // Scroll one card width
          carousel.scrollLeft += carousel.clientWidth / 3;
        }
      }, 5000); // Change slide every 5 seconds
    };

    startAutoScroll();

    // Pause auto-scroll when user interacts with the carousel
    const pauseAutoScroll = () => {
      clearInterval(scrollInterval);
    };

    const resumeAutoScroll = () => {
      clearInterval(scrollInterval);
      startAutoScroll();
    };

    carousel.addEventListener('mouseenter', pauseAutoScroll);
    carousel.addEventListener('mouseleave', resumeAutoScroll);
    carousel.addEventListener('touchstart', pauseAutoScroll, { passive: true });
    carousel.addEventListener('touchend', resumeAutoScroll);

    return () => {
      clearInterval(scrollInterval);
      carousel.removeEventListener('mouseenter', pauseAutoScroll);
      carousel.removeEventListener('mouseleave', resumeAutoScroll);
      carousel.removeEventListener('touchstart', pauseAutoScroll);
      carousel.removeEventListener('touchend', resumeAutoScroll);
    };
  }, []);

  return (
    <div className='bg-gray-50 py-16'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-bold mb-4'>Our Collections</h2>
          <p className='text-gray-600 mb-6'>
            Discover our premium quality athletic wear
          </p>
          <div className='w-24 h-1 mx-auto bg-black'></div>
        </div>

        {/* Carousel Container */}
        <div className='relative'>
          {/* Carousel */}
          <div
            ref={carouselRef}
            className='flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8'
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className='min-w-[33.3%] px-3 snap-start flex-shrink-0'
              >
                <CollectionCard
                  category={category}
                  height='h-[400px]'
                  imageHeight='h-[300px]'
                />
              </div>
            ))}
          </div>

          {/* View All Collections Button */}
          <div className='text-center mt-8'>
            <Link
              to='/collection'
              className='inline-block bg-black text-white font-semibold py-3 px-8 rounded hover:bg-opacity-80 transition-colors duration-300'
            >
              View All Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCarousel;

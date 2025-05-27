import React, { useState, useEffect } from 'react';
import { FaLeaf, FaHandshake, FaUserFriends, FaAward } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Yogesh',
      position: 'CEO & Founder',
      image: '/images/team/team1.jpg',
      bio: "Yogesh drives the brand's vision with a passion for sustainable fashion and strategic growth.",
    },
    {
      name: 'Bhavana',
      position: 'Co-Founder & Creative Director',
      image: '/images/team/team3.jpg',
      bio: 'Bhawna brings our collections to life with a sharp eye for design and emerging trends.',
    },
    {
      name: 'Navneet',
      position: 'Co-Founder & COO',
      image: '/images/team/team3.jpg',
      bio: 'Navi ensures smooth operations and logistics to keep our supply chain efficient and eco-conscious.',
    },
    {
      name: 'Yash',
      position: 'CTO',
      image: '/images/team/team2.jpg',
      bio: 'Yash leads our technology initiatives with expertise in modern web solutions.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleMembers, setVisibleMembers] = useState([]);

  useEffect(() => {
    updateVisibleMembers();
  }, [activeIndex]);

  const updateVisibleMembers = () => {
    const totalMembers = teamMembers.length;
    const visibleIndexes = [
      activeIndex % totalMembers,
      (activeIndex + 1) % totalMembers,
      (activeIndex + 2) % totalMembers,
    ];

    setVisibleMembers(visibleIndexes.map((index) => teamMembers[index]));
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => {
      const totalMembers = teamMembers.length;
      return (prevIndex - 1 + totalMembers) % totalMembers;
    });
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => {
      const totalMembers = teamMembers.length;
      return (prevIndex + 1) % totalMembers;
    });
  };

  return (
    <div className='bg-black text-white min-h-screen'>
      <div className='container mx-auto px-4 py-12'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>About Horax</h1>
          <p className='text-xl text-gray-400'>
            Your Trusted Partner in Quality Products Since 2022
          </p>
          <div className='w-24 h-1 mx-auto bg-white mt-6'></div>
        </div>

        {/* Our Story Section */}
        <div className='flex flex-col md:flex-row items-center mb-20'>
          <div className='md:w-1/2 md:pr-8 mb-8 md:mb-0'>
            <h2 className='text-3xl font-semibold mb-6'>Our Story</h2>
            <p className='text-gray-300 mb-4'>
              Founded in 2022, Horax began with a simple mission: to provide
              high-quality products that make everyday life better. What started
              as a small operation run from a garage has grown into a trusted
              online retailer serving customers nationwide.
            </p>
            <p className='text-gray-300'>
              Our journey has been defined by a commitment to excellence and a
              passion for customer satisfaction. Through challenges and growth,
              we've maintained our core values while adapting to the
              ever-changing retail landscape.
            </p>
          </div>
          <div className='md:w-1/2'>
            <div className='rounded-lg overflow-hidden shadow-xl'>
              <img
                src='/images/about/our-story.jpg'
                alt='Horax Beginnings'
                className='w-full h-auto'
              />
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className='bg-gray-800 p-8 rounded-lg mb-20'>
          <h2 className='text-3xl font-semibold mb-6 text-center'>
            Our Mission
          </h2>
          <p className='text-gray-300 text-center mb-12 max-w-2xl mx-auto'>
            To empower our customers through quality products, exceptional
            service, and a seamless shopping experience.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <FaLeaf className='text-green-500 text-4xl mx-auto mb-4' />
              <h5 className='text-xl text-black font-semibold mb-2'>
                Sustainability
              </h5>
              <p className='text-gray-600'>
                Committed to eco-friendly practices in every aspect of our
                business
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <FaHandshake className='text-blue-500 text-4xl mx-auto mb-4' />
              <h5 className='text-xl text-black font-semibold mb-2'>
                Integrity
              </h5>
              <p className='text-gray-600'>
                Honest and transparent in all our customer and business
                relationships
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <FaUserFriends className='text-purple-500 text-4xl mx-auto mb-4' />
              <h5 className='text-xl text-black font-semibold mb-2'>
                Community
              </h5>
              <p className='text-gray-600'>
                Building relationships and giving back to our local communities
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md text-center'>
              <FaAward className='text-yellow-500 text-4xl mx-auto mb-4' />
              <h5 className='text-xl text-black font-semibold mb-2'>
                Excellence
              </h5>
              <p className='text-gray-600'>
                Striving for the highest quality in products and service
              </p>
            </div>
          </div>
        </div>

        {/* Team Section Carousel */}
        <div className='mb-20'>
          <h2 className='text-3xl font-semibold mb-12 text-center'>
            Meet Our Team
          </h2>

          {/* Carousel container with navigation controls */}
          <div className='relative'>
            {/* Previous button */}
            <button
              onClick={handlePrev}
              className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300'
              aria-label='Previous'
            >
              <FaChevronLeft />
            </button>

            {/* Team members grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-12'>
              {visibleMembers.map((member, index) => (
                <div
                  key={index}
                  className='rounded-lg overflow-hidden shadow-lg h-[500px] bg-[#141414] transition-all duration-500 ease-in-out'
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className='w-full h-[320px] rounded-lg bg-white p-2 object-cover'
                  />
                  <div className='pt-4 px-6 text-white'>
                    <h4 className='text-xl font-bold mb-1'>{member.name}</h4>
                    <p className='font-semibold mb-3'>{member.position}</p>
                    <p>{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300'
              aria-label='Next'
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Carousel indicators */}
          <div className='flex justify-center mt-8 space-x-2'>
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-white w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Values & Ethics Section */}
        <div className='bg-gray-800 p-10 rounded-lg'>
          <h2 className='text-3xl font-semibold mb-8 text-center'>
            Our Values & Ethics
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-black'>
            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='text-xl font-semibold mb-3'>Quality First</h3>
              <p className='text-gray-600'>
                We never compromise on quality. Every product undergoes rigorous
                testing and quality assurance before it reaches our customers.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='text-xl font-semibold mb-3'>
                Customer Satisfaction
              </h3>
              <p className='text-gray-600'>
                Your satisfaction is our priority. We stand behind our products
                with excellent customer service and hassle-free returns.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='text-xl font-semibold mb-3'>Ethical Sourcing</h3>
              <p className='text-gray-600'>
                We carefully select suppliers who meet our standards for fair
                labor practices and environmental responsibility.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='text-xl font-semibold mb-3'>Innovation</h3>
              <p className='text-gray-600'>
                We continuously seek new ways to improve our products and
                services, staying ahead of trends and technologies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

import React from 'react';
import HeroSection from '../components/HomePage/HeroSection';
import AboutUsSection from '../components/HomePage/AboutUsSection';
import CollectionCarousel from '../components/HomePage/CollectionCarousel';

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutUsSection />
      <CollectionCarousel />
    </>
  );
};

export default Home;

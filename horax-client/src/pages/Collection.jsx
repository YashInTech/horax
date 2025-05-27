import React from 'react';
import CollectionCard from '../components/CollectionCard';
import { categories } from '../data/categoriesData';

const Collection = () => {
  return (
    <div className='container mx-auto py-12 px-4'>
      {/* Page Header */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Collections</h1>
        <p className='text-xl text-gray-600'>
          Discover our premium quality athletic wear
        </p>
        <div className='w-24 h-1 mx-auto bg-black mt-6'></div>
      </div>

      {/* Categories Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {categories.map((category) => (
          <CollectionCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Collection;

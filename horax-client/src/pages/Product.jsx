import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaFilter,
  FaSortAmountDown,
  FaArrowLeft,
  FaShoppingCart,
} from 'react-icons/fa';

const Product = () => {
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sizes: [],
    colors: [],
  });
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  // Map category IDs from URL to product types
  const categoryMap = {
    tees: 'Tops',
    joggers: 'Bottoms',
    shorts: 'Bottoms',
    stringers: 'Tops',
    accessories: 'Accessories',
    'jackets-hoodies': 'Tops',
  };

  // Get friendly name for display
  const getCategoryDisplayName = (urlCat) => {
    const displayNames = {
      tees: 'T-Shirts',
      joggers: 'Joggers',
      shorts: 'Shorts',
      stringers: 'Stringers',
      accessories: 'Accessories',
      'jackets-hoodies': 'Jackets & Hoodies',
    };
    return displayNames[urlCat] || urlCat;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productType = categoryMap[productId];
        setCategoryName(getCategoryDisplayName(productId));

        // Build query parameters
        let queryParams = new URLSearchParams();
        queryParams.append('type', productType);

        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (sort) queryParams.append('sort', sort);

        // Special filter for jackets & hoodies
        if (productId === 'jackets-hoodies') {
          queryParams.append('search', 'jacket hoodie');
        }

        const response = await axios.get(
          `http://localhost:8000/api/products?${queryParams}`
        );
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId, filters, sort]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      sizes: [],
      colors: [],
    });
    setSort('newest');
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <Link
          to='/collection'
          className='flex items-center text-gray-600 hover:text-black'
        >
          <FaArrowLeft className='mr-2' />
          Back to Collections
        </Link>
      </div>

      <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold mb-4 md:mb-0'>{categoryName}</h1>

        <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded bg-white'
          >
            <FaFilter className='mr-2' />
            Filter
          </button>

          <div className='relative'>
            <div className='flex items-center border border-gray-300 rounded bg-white'>
              <FaSortAmountDown className='ml-3 text-gray-500' />
              <select
                className='appearance-none bg-transparent py-2 pl-2 pr-8 focus:outline-none'
                value={sort}
                onChange={handleSortChange}
              >
                <option value='newest'>Newest</option>
                <option value='price'>Price: Low to High</option>
                <option value='price-desc'>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className='bg-white p-4 mb-6 rounded shadow-md'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold'>Filters</h2>
            <button
              onClick={resetFilters}
              className='text-sm text-[#b6ff00] hover:underline'
            >
              Reset All
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Price Range */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Price Range
              </label>
              <div className='flex items-center'>
                <input
                  type='number'
                  name='minPrice'
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder='Min'
                  className='w-full border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black'
                />
                <span className='px-2 bg-gray-100 border-t border-b border-gray-300'>
                  to
                </span>
                <input
                  type='number'
                  name='maxPrice'
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder='Max'
                  className='w-full border border-gray-300 rounded-r px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black'
                />
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Size
              </label>
              <div className='flex flex-wrap gap-2'>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.sizes.includes(size)
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => {
                      setFilters((prev) => {
                        const newSizes = prev.sizes.includes(size)
                          ? prev.sizes.filter((s) => s !== size)
                          : [...prev.sizes, size];
                        return { ...prev, sizes: newSizes };
                      });
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className='bg-red-100 text-red-700 p-4 rounded mb-6'>{error}</div>
      )}

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-pulse flex space-x-2'>
            <div className='h-3 w-3 bg-black rounded-full'></div>
            <div className='h-3 w-3 bg-black rounded-full'></div>
            <div className='h-3 w-3 bg-black rounded-full'></div>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product._id}
                to={`/product-detail/${product._id}`}
                className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'
              >
                <div className='h-64 overflow-hidden'>
                  <img
                    src={product.images[0]}
                    alt={product.productName}
                    className='w-full h-full object-cover hover:scale-110 transition-transform duration-500'
                  />
                </div>
                <div className='p-4'>
                  <h3 className='font-medium text-gray-900 mb-1'>
                    {product.productName}
                  </h3>
                  <p className='text-gray-600 text-sm mb-2 line-clamp-1'>
                    {product.description}
                  </p>
                  <div className='flex justify-between items-center'>
                    <span className='font-bold text-lg'>
                      ₹{product.price.toFixed(2)}
                    </span>
                    <button className='p-2 rounded-full bg-black text-white hover:bg-opacity-80 transition-colors'>
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className='col-span-full text-center py-12'>
              <p className='text-gray-500 text-lg'>No products found.</p>
              <p className='text-gray-400 mt-2'>
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Product;

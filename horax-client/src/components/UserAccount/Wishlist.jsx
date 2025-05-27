import React, { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    const fetchWishlist = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 600));

        setWishlist([
          {
            id: 'aaaab',
            name: 'Men Round Neck Pure Cotton T-shirt',
            price: 599,
            image: '/images/products/tshirt.jpg',
            inStock: true,
            slug: 'men-round-neck-cotton-tshirt',
          },
          {
            id: 'aaaac',
            name: 'Linen Casual Shirt',
            price: 1299,
            image: '/images/products/shirt.jpg',
            inStock: true,
            slug: 'linen-casual-shirt',
          },
          {
            id: 'aaaad',
            name: 'Classic Denim Jeans',
            price: 1899,
            image: '/images/products/jeans.jpg',
            inStock: false,
            slug: 'classic-denim-jeans',
          },
        ]);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeItem = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className='p-6 flex justify-center'>
        <div className='animate-pulse flex space-x-2'>
          <div className='h-3 w-3 bg-[#b6ff00] rounded-full'></div>
          <div className='h-3 w-3 bg-[#b6ff00] rounded-full'></div>
          <div className='h-3 w-3 bg-[#b6ff00] rounded-full'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold'>My Wishlist</h2>
        <span className='text-sm text-gray-500'>{wishlist.length} items</span>
      </div>

      {wishlist.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {wishlist.map((item) => (
            <div
              key={item.id}
              className='border rounded-lg overflow-hidden group transition-all hover:shadow-md'
            >
              <div className='h-48 bg-gray-100 relative overflow-hidden'>
                <Link to={`/product/${item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/images/product-placeholder.jpg';
                    }}
                    className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-105'
                  />
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className='absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-gray-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors'
                  aria-label='Remove from wishlist'
                >
                  <FaTimes />
                </button>
              </div>

              <div className='p-4'>
                <Link to={`/product/${item.slug}`}>
                  <h3 className='font-medium mb-2 hover:text-[#50790d] transition-colors line-clamp-2'>
                    {item.name}
                  </h3>
                </Link>
                <p className='text-lg font-semibold mb-3'>
                  ₹{item.price.toFixed(2)}
                </p>

                <div className='flex space-x-2'>
                  <button
                    disabled={!item.inStock}
                    className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 ${
                      item.inStock
                        ? 'bg-[#b6ff00] text-black hover:bg-opacity-80'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FaShoppingCart />
                    <span>{item.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 border rounded-lg'>
          <FaHeart className='mx-auto text-4xl text-gray-300 mb-4' />
          <p className='text-xl font-medium text-gray-500 mb-2'>
            Your wishlist is empty
          </p>
          <p className='text-gray-400 mb-6'>
            Add items to your wishlist to keep track of products you're
            interested in
          </p>
          <Link
            to='/collection'
            className='px-6 py-2 bg-[#b6ff00] text-black rounded-md hover:bg-opacity-80'
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;

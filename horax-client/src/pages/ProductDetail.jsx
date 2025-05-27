import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowLeft,
  FaShoppingCart,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/products/${id}`
        );
        setProduct(response.data);
        // Set default size when product loads
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size');
      return;
    }

    try {
      setAddingToCart(true);

      // Check if user is logged in
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))._id
        : null;

      if (token && userId) {
        // User is logged in, add to their cart
        await axios.post(
          `http://localhost:8000/api/cart/${userId}/add`,
          { productId: product._id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // User is not logged in, store in local storage
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        const existingItemIndex = guestCart.findIndex(
          (item) => item.productId === product._id && item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
          // Update quantity if product already in cart
          guestCart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          guestCart.push({
            productId: product._id,
            name: product.productName,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            quantity: quantity,
          });
        }

        localStorage.setItem('guestCart', JSON.stringify(guestCart));
      }

      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className='text-yellow-400' />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key='half-star' className='text-yellow-400' />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-star-${i}`} className='text-yellow-400' />
      );
    }

    return stars;
  };

  // Create a random rating for demo
  const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-16 flex justify-center'>
        <div className='animate-pulse flex space-x-2'>
          <div className='h-3 w-3 bg-[#b6ff00] rounded-full'></div>
          <div className='h-3 w-3 bg-[#b6ff00] rounded-full'></div>
          <div className='h-3 w-3 bg-[#b6ff00] rounded-full'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='bg-red-100 text-red-700 p-4 rounded'>{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <p className='text-xl text-gray-600'>Product not found</p>
          <Link
            to='/collection'
            className='text-[#b6ff00] hover:underline mt-4 inline-block'
          >
            Return to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <Link
          to={`/collection`}
          className='flex items-center text-gray-600 hover:text-black'
        >
          <FaArrowLeft className='mr-2' />
          Back to Products
        </Link>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Product Images */}
        <div className='lg:w-1/2'>
          <div className='bg-white rounded-lg overflow-hidden mb-4'>
            <img
              src={product.images[mainImage]}
              alt={product.productName}
              className='w-full h-[500px] object-cover object-center'
            />
          </div>

          {product.images.length > 1 && (
            <div className='grid grid-cols-5 gap-2'>
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded overflow-hidden ${
                    index === mainImage
                      ? 'border-[#b6ff00]'
                      : 'border-transparent'
                  }`}
                  onClick={() => setMainImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.productName} - View ${index + 1}`}
                    className='h-20 w-full object-cover'
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='lg:w-1/2'>
          <h1 className='text-3xl font-bold mb-2'>{product.productName}</h1>

          <div className='flex items-center mb-4'>
            <div className='flex mr-2'>{renderStars(rating)}</div>
            <span className='text-sm text-gray-500'>
              ({Math.floor(Math.random() * 200) + 10} reviews)
            </span>
          </div>

          <div className='text-2xl font-bold mb-6'>
            ₹{product.price.toFixed(2)}
            {product.discount > 0 && (
              <>
                <span className='ml-2 text-lg text-gray-500 line-through'>
                  ₹
                  {((product.price * 100) / (100 - product.discount)).toFixed(
                    2
                  )}
                </span>
                <span className='ml-2 text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded'>
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className='text-gray-700 mb-6'>{product.description}</p>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-sm font-medium text-gray-900 mb-2'>Size</h3>
              <div className='flex flex-wrap gap-2'>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      selectedSize === size
                        ? 'bg-[#b6ff00] border-[#b6ff00] text-black'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-sm font-medium text-gray-900 mb-2'>Color</h3>
              <div className='flex flex-wrap gap-2'>
                {product.colors.map((color) => {
                  const colorValue =
                    colorMap[color.toLowerCase()] || color.toLowerCase();
                  return (
                    <div
                      key={color}
                      className='w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-black'
                      style={{ backgroundColor: colorValue }}
                      title={color}
                    ></div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className='mb-6'>
            <h3 className='text-sm font-medium text-gray-900 mb-2'>Quantity</h3>
            <div className='flex items-center'>
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className='p-2 border border-gray-300 rounded-l'
                disabled={quantity <= 1}
              >
                <FaMinus className='text-gray-500' />
              </button>
              <input
                type='number'
                min='1'
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className='w-16 border-t border-b border-gray-300 p-2 text-center focus:outline-none'
              />
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className='p-2 border border-gray-300 rounded-r'
                disabled={quantity >= product.stock}
              >
                <FaPlus className='text-gray-500' />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className='flex gap-4 mb-8'>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock <= 0}
              className={`flex-1 py-3 px-8 rounded-md font-medium text-lg flex items-center justify-center gap-2 
                ${
                  product.stock > 0
                    ? 'bg-[#b6ff00] text-black hover:bg-opacity-90'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
              <FaShoppingCart />
              {addingToCart
                ? 'Adding...'
                : addedToCart
                ? 'Added to Cart!'
                : 'Add to Cart'}
            </button>
          </div>

          {/* Product Details */}
          <div className='border-t border-gray-200 pt-6'>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-gray-500'>Material</p>
                <p>{product.material || 'Cotton Blend'}</p>
              </div>
              <div>
                <p className='text-gray-500'>Stock</p>
                <p>
                  {product.stock > 0
                    ? `${product.stock} units`
                    : 'Out of stock'}
                </p>
              </div>
              <div>
                <p className='text-gray-500'>Category</p>
                <p>{product.category}</p>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className='mt-4'>
                <p className='text-gray-500 mb-1'>Features</p>
                <ul className='list-disc pl-5 text-sm text-gray-700'>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Color mapping for display
const colorMap = {
  black: '#000000',
  white: '#ffffff',
  grey: '#808080',
  blue: '#0000ff',
  red: '#ff0000',
  green: '#008000',
  yellow: '#ffff00',
  purple: '#800080',
  camo: 'linear-gradient(45deg, #4B5320, #708238, #A9A9A9, #3A5F0B)',
};

export default ProductDetail;

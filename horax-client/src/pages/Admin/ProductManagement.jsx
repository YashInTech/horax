import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.products || response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(products.filter((product) => product._id !== id));
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Product Management</h1>
        <Link
          to='/admin/add-product'
          className='bg-black text-white py-2 px-4 rounded flex items-center hover:bg-opacity-80'
        >
          <FaPlus className='mr-2' /> Add New Product
        </Link>
      </div>

      {error && (
        <div
          className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6'
          role='alert'
        >
          <p>{error}</p>
        </div>
      )}

      <div className='mb-6 relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <FaSearch className='text-gray-400' />
        </div>
        <input
          type='text'
          placeholder='Search products...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10 w-full md:w-1/3 border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-1 focus:ring-black'
        />
      </div>

      <div className='bg-white shadow-md rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Product
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Price
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.productName}
                            className='h-10 w-10 object-cover rounded-sm mr-3'
                          />
                        )}
                        <span className='font-medium'>
                          {product.productName}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      ₹{product.price}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {product.category}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          product.featured
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.featured ? 'Featured' : 'Regular'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex space-x-2'>
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className='text-red-600 hover:text-red-900'
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan='5'
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;

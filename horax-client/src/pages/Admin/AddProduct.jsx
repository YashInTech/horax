import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUpload, FaSpinner } from 'react-icons/fa';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    category: 'Men',
    type: 'Tops',
    sizes: [],
    colors: [],
    material: '',
    features: [],
    stock: '',
    discount: '0',
    bestseller: false,
    featured: false,
  });
  
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8000/api';
  
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Grey'];
  const categoryOptions = ['Men', 'Women', 'Kids'];
  const typeOptions = ['Tops', 'Bottoms', 'Accessories', 'Equipment'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleMultiSelect = (e, field) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [field]: formData[field].includes(value)
        ? formData[field].filter((item) => item !== value)
        : [...formData[field], value],
    });
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Check for required fields
      if (!formData.productName || !formData.description || !formData.price || images.length === 0) {
        setError('Product name, description, price, and at least one image are required');
        setLoading(false);
        return;
      }
      
      // Create form data for file upload
      const productData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          productData.append(key, JSON.stringify(formData[key]));
        } else {
          productData.append(key, formData[key]);
        }
      });
      
      // Append all images
      images.forEach(image => {
        productData.append('images', image);
      });
      
      // Send request
      const response = await axios.post(
        `${API_URL}/products/add`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setSuccess('Product added successfully!');
      
      // Clear form after successful submission
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
      
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">{success}</div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>
          
          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black"
              min="0"
              required
            />
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Stock */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black"
              min="0"
            />
          </div>
          
          {/* Discount */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black"
              min="0"
              max="100"
            />
          </div>
          
          {/* Material */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Material
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          
          {/* Sizes */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <label key={size} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={size}
                    checked={formData.sizes.includes(size)}
                    onChange={(e) => handleMultiSelect(e, 'sizes')}
                    className="mr-1"
                  />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Colors */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Available Colors
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <label key={color} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={color}
                    checked={formData.colors.includes(color)}
                    onChange={(e) => handleMultiSelect(e, 'colors')}
                    className="mr-1"
                  />
                  <span className="text-sm">{color}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Special Flags */}
          <div className="flex space-x-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
                className="mr-1"
              />
              <span>Bestseller</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-1"
              />
              <span>Featured</span>
            </label>
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black"
            required
          ></textarea>
        </div>
        
        {/* Image Upload */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Product Images *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id="product-images"
            />
            <label htmlFor="product-images" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <FaUpload className="text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500">Click to upload images</p>
                <p className="text-gray-400 text-sm">(Max 5 images, JPEG, PNG, or WEBP)</p>
              </div>
            </label>
          </div>
          
          {/* Image Previews */}
          {previewImages.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-700 font-medium mb-2">Selected Images:</p>
              <div className="flex flex-wrap gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="bg-black text-white py-2 px-6 rounded-md hover:bg-opacity-80 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin mr-2" /> Adding Product...
              </span>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
import React, { useState, useEffect } from 'react';
import { FaHome, FaBuilding, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Addresses = () => {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    addressType: 'home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    // Simulate API fetch
    const fetchAddresses = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 700));

        setAddresses([
          {
            id: 1,
            name: 'Home',
            addressType: 'home',
            line1: '123 Main Street',
            line2: 'Apartment 4B',
            city: 'New Delhi',
            state: 'Delhi',
            postalCode: '110001',
            country: 'India',
            phone: '+91 9876543210',
            isDefault: true,
          },
          {
            id: 2,
            name: 'Office',
            addressType: 'office',
            line1: '456 Business Park',
            line2: 'Building C, Floor 3',
            city: 'Gurgaon',
            state: 'Haryana',
            postalCode: '122001',
            country: 'India',
            phone: '+91 9876543211',
            isDefault: false,
          },
        ]);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation could go here

    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress
            ? { ...formData, id: editingAddress }
            : addr
        )
      );
    } else {
      // Add new address
      setAddresses([...addresses, { ...formData, id: Date.now() }]);
    }

    resetForm();
  };

  const startEditing = (address) => {
    setEditingAddress(address.id);
    setFormData(address);
    setShowAddressForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      addressType: 'home',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: '',
      isDefault: false,
    });
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const removeAddress = (id) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const makeDefault = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  if (loading) {
    return (
      <div className='p-6 flex justify-center'>
        <div className='animate-pulse flex space-x-2'>
          <div className='h-3 w-3 bg-black rounded-full'></div>
          <div className='h-3 w-3 bg-black rounded-full'></div>
          <div className='h-3 w-3 bg-black rounded-full'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold'>My Addresses</h2>
        <button
          onClick={() => {
            resetForm();
            setShowAddressForm(!showAddressForm);
          }}
          className='px-4 py-2 bg-black text-white rounded-md hover:bg-opacity-80 flex items-center gap-2'
        >
          {showAddressForm ? (
            'Cancel'
          ) : (
            <>
              <FaPlus size={14} />
              <span>Add New Address</span>
            </>
          )}
        </button>
      </div>

      {showAddressForm && (
        <div className='border rounded-lg p-6 mb-8 bg-gray-50'>
          <h3 className='font-semibold mb-4'>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>

          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
          >
            <div>
              <label className='block text-gray-700 mb-1'>Address Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='e.g. Home, Office'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-1'>Address Type</label>
              <div className='flex gap-4 mt-1'>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='addressType'
                    value='home'
                    checked={formData.addressType === 'home'}
                    onChange={handleInputChange}
                    className='mr-2'
                  />
                  <FaHome className='text-black mr-1' />
                  Home
                </label>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='addressType'
                    value='office'
                    checked={formData.addressType === 'office'}
                    onChange={handleInputChange}
                    className='mr-2'
                  />
                  <FaBuilding className='text-black mr-1' />
                  Office
                </label>
              </div>
            </div>

            <div className='md:col-span-2'>
              <label className='block text-gray-700 mb-1'>Address Line 1</label>
              <input
                type='text'
                name='line1'
                value={formData.line1}
                onChange={handleInputChange}
                placeholder='Street address, P.O. box'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-gray-700 mb-1'>Address Line 2</label>
              <input
                type='text'
                name='line2'
                value={formData.line2}
                onChange={handleInputChange}
                placeholder='Apartment, suite, unit, building (optional)'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-1'>City</label>
              <input
                type='text'
                name='city'
                value={formData.city}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-1'>State</label>
              <input
                type='text'
                name='state'
                value={formData.state}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-1'>Postal Code</label>
              <input
                type='text'
                name='postalCode'
                value={formData.postalCode}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-1'>Country</label>
              <input
                type='text'
                name='country'
                value={formData.country}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-1'>Phone Number</label>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
              />
            </div>

            <div className='md:col-span-2 mt-2'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  name='isDefault'
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className='mr-2'
                />
                Set as default delivery address
              </label>
            </div>

            <div className='md:col-span-2 flex justify-end mt-4'>
              <button
                type='submit'
                className='px-6 py-2 bg-black text-black rounded-md hover:bg-opacity-80'
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.id} className='border rounded-lg p-5'>
              <div className='flex justify-between items-start mb-3'>
                <div className='flex items-center'>
                  <h3 className='font-semibold'>{address.name}</h3>
                  {address.isDefault && (
                    <span className='ml-2 text-xs bg-black text-white px-2 py-0.5 rounded-full'>
                      Default
                    </span>
                  )}
                </div>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => startEditing(address)}
                    className='p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full'
                    aria-label='Edit address'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => removeAddress(address.id)}
                    className='p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full'
                    aria-label='Delete address'
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className='flex items-start mb-2'>
                {address.addressType === 'home' ? (
                  <FaHome className='text-[#50790d] mt-1 mr-2' />
                ) : (
                  <FaBuilding className='text-[#50790d] mt-1 mr-2' />
                )}
                <div className='text-gray-600'>
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
              </div>

              <p className='text-gray-600 mb-4'>Phone: {address.phone}</p>

              {!address.isDefault && (
                <button
                  onClick={() => makeDefault(address.id)}
                  className='text-sm text-black hover:underline'
                >
                  Set as default
                </button>
              )}
            </div>
          ))
        ) : (
          <div className='col-span-full text-center py-12 border rounded-lg'>
            <p className='text-gray-500'>
              You haven't added any addresses yet.
            </p>
            <button
              onClick={() => setShowAddressForm(true)}
              className='mt-4 px-6 py-2 bg-black text-black rounded-md hover:bg-opacity-80'
            >
              Add Your First Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;

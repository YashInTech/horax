import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingBag, FaTruck } from 'react-icons/fa';

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API fetch
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        setOrders([
          {
            id: 'ORD12345',
            date: '2023-05-15',
            status: 'Delivered',
            total: 1299.0,
            items: 3,
            tracking: 'DELHXP2023456',
            products: [
              {
                id: 1,
                name: 'Cotton Summer T-Shirt',
                price: 599,
                image: '/images/products/tshirt.jpg',
                quantity: 1,
              },
              {
                id: 2,
                name: 'Linen Casual Shirt',
                price: 499,
                image: '/images/products/shirt.jpg',
                quantity: 2,
              },
            ],
          },
          {
            id: 'ORD12346',
            date: '2023-04-28',
            status: 'Processing',
            total: 849.0,
            items: 1,
            tracking: 'DELHXP2023457',
            products: [
              {
                id: 3,
                name: 'Classic Denim Jeans',
                price: 849,
                image: '/images/products/jeans.jpg',
                quantity: 1,
              },
            ],
          },
        ]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h2 className='text-2xl font-semibold'>My Orders</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search by order ID'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
          />
          <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className='space-y-6'>
          {filteredOrders.map((order) => (
            <div key={order.id} className='border rounded-lg overflow-hidden'>
              <div className='bg-gray-50 p-4 flex flex-wrap justify-between items-center border-b'>
                <div className='mb-2 sm:mb-0'>
                  <span className='text-sm text-gray-500'>Order ID: </span>
                  <span className='font-medium'>{order.id}</span>
                </div>
                <div className='mb-2 sm:mb-0'>
                  <span className='text-sm text-gray-500 mr-2'>Date: </span>
                  <span>{order.date}</span>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className='p-4'>
                <h3 className='font-medium mb-3'>Products</h3>
                <div className='space-y-3'>
                  {order.products.map((product) => (
                    <div
                      key={product.id}
                      className='flex items-center gap-4 border-b pb-3'
                    >
                      <div className='w-16 h-16 border rounded bg-gray-50'>
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = '/images/product-placeholder.jpg';
                          }}
                          className='w-full h-full object-contain'
                        />
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-medium'>{product.name}</h4>
                        <p className='text-sm text-gray-500'>
                          Quantity: {product.quantity}
                        </p>
                      </div>
                      <div className='font-medium'>
                        ₹{product.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='flex justify-between items-center mt-4'>
                  <div>
                    <span className='text-gray-500'>Total: </span>
                    <span className='font-semibold'>
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className='flex space-x-3'>
                    <button className='flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50'>
                      <FaShoppingBag />
                      <span>View Details</span>
                    </button>

                    <button className='flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-opacity-80'>
                      <FaTruck />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 border rounded-lg'>
          <FaShoppingBag className='mx-auto text-4xl text-gray-300 mb-4' />
          <p className='text-xl font-medium text-gray-500 mb-2'>
            No orders found
          </p>
          <p className='text-gray-400 mb-6'>
            {searchTerm
              ? 'No orders match your search'
              : "You haven't placed any orders yet"}
          </p>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='text-black hover:underline'
            >
              Clear search
            </button>
          )}

          {!searchTerm && (
            <button className='px-6 py-2 bg-black text-black rounded-md hover:bg-opacity-80'>
              Start Shopping
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;

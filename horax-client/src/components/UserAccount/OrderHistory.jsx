import React, { useState, useEffect } from 'react';
import {
  FaHistory,
  FaSearch,
  FaFileDownload,
  FaChevronDown,
} from 'react-icons/fa';

const OrderHistory = () => {
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchOrderHistory = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        setOrderHistory([
          {
            id: 'ORD12345',
            date: '2023-05-15',
            status: 'Delivered',
            total: 1299.0,
            items: [
              { name: 'Cotton Summer T-Shirt', quantity: 1, price: 599 },
              { name: 'Linen Casual Shirt', quantity: 2, price: 350 },
            ],
            paymentMethod: 'Credit Card',
          },
          {
            id: 'ORD12346',
            date: '2023-04-28',
            status: 'Delivered',
            total: 849.0,
            items: [{ name: 'Classic Denim Jeans', quantity: 1, price: 849 }],
            paymentMethod: 'UPI',
          },
          {
            id: 'ORD12347',
            date: '2023-03-12',
            status: 'Delivered',
            total: 2199.0,
            items: [
              { name: 'Winter Jacket', quantity: 1, price: 1599 },
              { name: 'Wool Scarf', quantity: 1, price: 600 },
            ],
            paymentMethod: 'Credit Card',
          },
          {
            id: 'ORD12348',
            date: '2023-02-05',
            status: 'Cancelled',
            total: 999.0,
            items: [{ name: 'Running Shoes', quantity: 1, price: 999 }],
            paymentMethod: 'Cash on Delivery',
          },
          {
            id: 'ORD12349',
            date: '2023-01-20',
            status: 'Delivered',
            total: 1599.0,
            items: [
              { name: 'Leather Wallet', quantity: 1, price: 499 },
              { name: 'Formal Shirt', quantity: 1, price: 1100 },
            ],
            paymentMethod: 'Credit Card',
          },
        ]);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  // Filter and sort orders
  const filteredOrders = orderHistory
    .filter((order) => {
      // Apply status filter
      if (
        filterStatus !== 'all' &&
        order.status.toLowerCase() !== filterStatus
      ) {
        return false;
      }

      // Apply search filter
      return order.id.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      // Apply sorting
      const [field, direction] = sortBy.split('_');

      if (field === 'date') {
        return direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (field === 'amount') {
        return direction === 'asc' ? a.total - b.total : b.total - a.total;
      }

      return 0;
    });

  const toggleOrderDetails = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
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
      <h2 className='text-2xl font-semibold mb-6'>Order History</h2>

      <div className='flex flex-wrap gap-4 justify-between items-center mb-6'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search by order ID'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b6ff00]'
          />
          <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
        </div>

        <div className='flex flex-wrap gap-3'>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b6ff00]'
          >
            <option value='all'>All Statuses</option>
            <option value='delivered'>Delivered</option>
            <option value='processing'>Processing</option>
            <option value='shipped'>Shipped</option>
            <option value='cancelled'>Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b6ff00]'
          >
            <option value='date_desc'>Newest First</option>
            <option value='date_asc'>Oldest First</option>
            <option value='amount_desc'>Amount: High to Low</option>
            <option value='amount_asc'>Amount: Low to High</option>
          </select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Order ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Details
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap font-medium'>
                      {order.id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {order.date}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap font-medium'>
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className='text-[#141414] hover:underline flex items-center'
                      >
                        <span>View</span>
                        <FaChevronDown
                          className={`ml-1 transition-transform ${
                            expandedOrder === order.id
                              ? 'transform rotate-180'
                              : ''
                          }`}
                        />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row with order details */}
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan='5' className='px-6 py-4 bg-gray-50'>
                        <div className='mb-3'>
                          <h4 className='font-medium mb-2'>Order Items</h4>
                          <table className='min-w-full divide-y divide-gray-200 border'>
                            <thead className='bg-gray-100'>
                              <tr>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500'>
                                  Item
                                </th>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500'>
                                  Qty
                                </th>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500'>
                                  Price
                                </th>
                                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500'>
                                  Subtotal
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, idx) => (
                                <tr key={idx} className='border-t'>
                                  <td className='px-4 py-2'>{item.name}</td>
                                  <td className='px-4 py-2'>{item.quantity}</td>
                                  <td className='px-4 py-2'>
                                    ₹{item.price.toFixed(2)}
                                  </td>
                                  <td className='px-4 py-2'>
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <p>
                              <span className='text-gray-600'>
                                Payment Method:
                              </span>{' '}
                              {order.paymentMethod}
                            </p>
                          </div>

                          <div className='flex justify-end'>
                            <button className='flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'>
                              <FaFileDownload />
                              <span>Download Invoice</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='text-center py-12 border rounded-lg'>
          <FaHistory className='mx-auto text-4xl text-gray-300 mb-4' />
          <p className='text-xl font-medium text-gray-500 mb-2'>
            No orders found
          </p>
          <p className='text-gray-400 mb-6'>
            {searchTerm || filterStatus !== 'all'
              ? 'No orders match your filter criteria'
              : "You haven't placed any orders yet"}
          </p>

          {(searchTerm || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className='px-6 py-2 bg-[#b6ff00] text-black rounded-md hover:bg-opacity-80'
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

import React, { useState, useEffect } from 'react';
import { FaBox, FaShoppingBag, FaUsers, FaRupeeSign } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className='bg-white rounded-lg shadow p-6 flex items-center'>
      <div className={`${color} p-4 rounded-full mr-4`}>{icon}</div>
      <div>
        <h3 className='text-gray-500 text-sm'>{title}</h3>
        <p className='text-2xl font-semibold'>{value}</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // This is a simplified example - you might need to create these endpoints
        const [productsRes, ordersRes, usersRes, recentOrdersRes] =
          await Promise.all([
            axios.get(`${API_URL}/products`, { headers }),
            axios.get(`${API_URL}/orders?limit=5`, { headers }),
            axios.get(`${API_URL}/users/count`, { headers }),
            axios.get(`${API_URL}/orders?limit=5`, { headers }),
          ]);

        // Calculate revenue from orders
        const totalRevenue = ordersRes.data.orders?.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        setStats({
          products: productsRes.data.length || 0,
          orders: ordersRes.data.pagination?.total || 0,
          users: usersRes.data.count || 0,
          revenue: totalRevenue || 0,
        });

        setRecentOrders(recentOrdersRes.data.orders || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set some default data for demo
        setStats({
          products: 12,
          orders: 34,
          users: 56,
          revenue: 78900,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <div className='h-full'>
      <h1 className='text-2xl font-bold mb-6'>Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <DashboardCard
          title='Total Products'
          value={stats.products}
          icon={<FaBox className='text-blue-600 text-xl' />}
          color='bg-blue-100'
        />
        <DashboardCard
          title='Total Orders'
          value={stats.orders}
          icon={<FaShoppingBag className='text-green-600 text-xl' />}
          color='bg-green-100'
        />
        <DashboardCard
          title='Total Users'
          value={stats.users}
          icon={<FaUsers className='text-purple-600 text-xl' />}
          color='bg-purple-100'
        />
        <DashboardCard
          title='Revenue'
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={<FaRupeeSign className='text-yellow-600 text-xl' />}
          color='bg-yellow-100'
        />
      </div>

      {/* Quick Access & Recent Orders */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-lg font-semibold mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-2 gap-4'>
            <Link
              to='/admin/add-product'
              className='bg-black text-white py-2 px-4 rounded text-center hover:bg-opacity-80'
            >
              Add New Product
            </Link>
            <Link
              to='/admin/products'
              className='bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300'
            >
              Manage Products
            </Link>
            <Link
              to='/admin/orders'
              className='bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300'
            >
              Manage Orders
            </Link>
            <Link
              to='/admin/users'
              className='bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300'
            >
              Manage Users
            </Link>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-lg font-semibold mb-4'>Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Order ID
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Customer
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className='px-4 py-2 whitespace-nowrap'>
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className='px-4 py-2 whitespace-nowrap'>
                        {order.user?.email || 'N/A'}
                      </td>
                      <td className='px-4 py-2 whitespace-nowrap'>
                        ₹{order.totalAmount}
                      </td>
                      <td className='px-4 py-2 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              order.status === 'delivered' &&
                              'bg-green-100 text-green-800'
                            }
                            ${
                              order.status === 'shipped' &&
                              'bg-blue-100 text-blue-800'
                            }
                            ${
                              order.status === 'pending' &&
                              'bg-yellow-100 text-yellow-800'
                            }
                            ${
                              order.status === 'cancelled' &&
                              'bg-red-100 text-red-800'
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-gray-500 text-center py-4'>No recent orders</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

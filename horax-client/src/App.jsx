import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Import your existing components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import AboutUs from './pages/AboutUs';
import GetInTouch from './pages/GetInTouch';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import MyAccount from './pages/MyAccount';

// Import admin components
import AdminRoute from './components/Admin/AdminRoute';
import Dashboard from './pages/Admin/Dashboard';
import ProductManagement from './pages/Admin/ProductManagement';
import AddProduct from './pages/Admin/AddProduct';
import EditProduct from './pages/Admin/EditProduct';

// Import auth context
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <div className='flex flex-col min-h-screen'>
        <Routes>
          {/* Admin Routes with AdminRoute protection */}
          <Route
            path='/admin'
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/products'
            element={
              <AdminRoute>
                <ProductManagement />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/add-product'
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/edit-product/:id'
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />

          {/* Public Routes */}
          <Route
            path='/*'
            element={
              <>
                <Navbar />
                <div className='flex-grow'>
                  <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/collection' element={<Collection />} />
                    <Route path='/about-us' element={<AboutUs />} />
                    <Route path='/get-in-touch' element={<GetInTouch />} />
                    <Route
                      path='/collection/:productId'
                      element={<Product />}
                    />
                    <Route
                      path='/product-detail/:id'
                      element={<ProductDetail />}
                    />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/my-account/*' element={<MyAccount />} />
                  </Routes>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;

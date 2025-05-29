import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import User from '../models/User';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userJSON = localStorage.getItem('user');
        if (userJSON) {
          const userData = JSON.parse(userJSON);
          const user = new User(userData);
          setCurrentUser(user);
          setIsAdmin(user.isAdmin());
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        const user = new User(res.data.user);
        setCurrentUser(user);
        setIsAdmin(user.isAdmin());

        return { success: true };
      }
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        return { needsVerification: true, email };
      }
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const googleLogin = async (token) => {
    try {
      console.log('Sending token to backend');

      const res = await axios.post(`${API_URL}/auth/google/callback`, {
        token,
      });

      console.log('Received response from backend:', res.data);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        const user = new User(res.data.user);
        setCurrentUser(user);
        setIsAdmin(user.isAdmin());
        
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error('Google login error:', err);
      const errorMessage = err.response?.data?.message || 'Google login failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

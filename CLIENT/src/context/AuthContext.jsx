import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {

        toast.error(
          error.response?.data?.error ||
          error.message ||
          'Login failed'
        );

        return {
          success: false,
          error:
            error.response?.data?.error ||
            error.message ||
            'Login failed'
        }
      }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup({ name, email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure? This will delete all your notes and bookmarks.')) {
      return;
    }
    
    try {
      await authAPI.deleteAccount();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Account deleted successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete account');
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    deleteAccount,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
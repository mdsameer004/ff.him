import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mocked session
    const storedUser = localStorage.getItem('friends-florist-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const API_BASE_URL = window.API_BASE_URL || '/api';
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid email or password');
      }
      const data = await response.json();
      const userData = data.user || { email, role: 'admin', name: 'Admin User' };
      setUser(userData);
      localStorage.setItem('ff_jwt_token', data.token);
      localStorage.setItem('friends-florist-user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
      if (window.API_FALLBACK || isNetworkError) {
        // Fallback to local storage mock user credentials
        console.info('[Auth Context Backend Fallback] Verifying credentials via simulated fallback auth database.');
        if (email === mockUser.email && password === 'password') {
          setUser(mockUser);
          localStorage.setItem('ff_jwt_token', 'mock-jwt-token-for-admin-friends-florist');
          localStorage.setItem('friends-florist-user', JSON.stringify(mockUser));
          return mockUser;
        } else if ((email === 'editor' || email === 'editor@admin.com') && password === 'editor') {
          const { mockAdmin } = await import('../data/mockData');
          setUser(mockAdmin);
          localStorage.setItem('ff_jwt_token', 'mock-jwt-token-for-editor');
          localStorage.setItem('friends-florist-user', JSON.stringify(mockAdmin));
          return mockAdmin;
        }
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('friends-florist-user');
    localStorage.removeItem('ff_jwt_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

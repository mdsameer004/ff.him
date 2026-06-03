import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, initialOrders } from '../data/mockData';
import { API_BASE_URL } from '../config/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('friends-florist-products');
    return stored ? JSON.parse(stored) : initialProducts;
  });

  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem('friends-florist-orders');
    return stored ? JSON.parse(stored) : initialOrders;
  });

  // API_BASE_URL is imported from src/config/api.js — points to deployed backend.

  // Helper for authenticated headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('ff_jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  // Fetch active products and orders on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const prodRes = await fetch(`${API_BASE_URL}/products`);
        if (prodRes.ok) {
          const prodEnvelope = await prodRes.json();
          // Backend returns: { success: true, count: N, data: Product[] }
          const prodData = Array.isArray(prodEnvelope) ? prodEnvelope : (prodEnvelope.data || []);
          console.log('[DataContext] Loaded', prodData.length, 'products from backend');
          setProducts(prodData);
        } else {
          console.error('[DataContext] GET /products failed with status', prodRes.status);
        }

        const ordRes = await fetch(`${API_BASE_URL}/orders`, {
          headers: getAuthHeaders()
        });
        if (ordRes.ok) {
          const ordEnvelope = await ordRes.json();
          const ordData = Array.isArray(ordEnvelope) ? ordEnvelope : (ordEnvelope.data || []);
          console.log('[DataContext] Loaded', ordData.length, 'orders from backend');
          setOrders(ordData);
        } else {
          console.error('[DataContext] GET /orders failed with status', ordRes.status);
        }
      } catch (err) {
        console.error('[DataContext] Failed to load from backend. Using local fallback.', err.message);
      }
    };

    loadInitialData();
  }, []);

  // Sync state mutations to localStorage as local simulated DB fallback
  useEffect(() => {
    localStorage.setItem('friends-florist-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('friends-florist-orders', JSON.stringify(orders));
  }, [orders]);

  const addProduct = async (product) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(product)
      });
      if (response.ok) {
        const envelope = await response.json();
        // Unwrap envelope: backend returns { success, data: newProduct }
        const newProduct = (envelope && envelope.data) ? envelope.data : envelope;
        setProducts(prev => [...prev, newProduct]);
        return;
      } else {
        console.error('[DataContext] POST /products failed with status', response.status);
      }
    } catch (err) {
      console.error('[DataContext] POST /products error:', err.message);
    }
    // Fallback
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedProduct)
      });
      if (response.ok) {
        const envelope = await response.json();
        const newProduct = (envelope && envelope.data) ? envelope.data : envelope;
        setProducts(prev => prev.map(p => p.id === id ? newProduct : p));
        return;
      } else {
        console.error(`[DataContext] PUT /products/${id} failed with status`, response.status);
      }
    } catch (err) {
      console.error(`[DataContext] PUT /products/${id} error:`, err.message);
    }
    // Fallback
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return;
      }
    } catch (err) {
      console.warn(`[Data Context Fallback] DELETE /products/${id} failed, modifying simulated client DB.`, err.message);
    }
    // Fallback
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <DataContext.Provider value={{ products, orders, addProduct, updateProduct, deleteProduct }}>
      {children}
    </DataContext.Provider>
  );
};

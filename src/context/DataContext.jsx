import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialOrders } from '../data/mockData';
import { API_BASE_URL } from '../config/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Start empty — fetchProducts() populates from backend on mount
  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem('friends-florist-orders');
    return stored ? JSON.parse(stored) : initialOrders;
  });

  // Helper for authenticated headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('ff_jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  // ─── Normalize a single product from backend schema → UI schema ──────────────
  // Backend: { _id, image: string, price: number, category: string, ... }
  // UI needs: { _id, images: string[], rating, reviews, featured, ... }
  const normalizeProduct = (p) => ({
    ...p,
    // Normalize image field: prefer images[] array, fall back to image string
    images: Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : [p.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800'],
    // Provide safe defaults for fields the UI reads
    rating: p.rating || 0,
    reviews: p.reviews || 0,
    featured: p.featured || false,
    price: Number(p.price) || 0,
    stock: Number(p.stock) || 0,
  });

  // ─── Single canonical product fetcher ────────────────────────────────────────
  // Always GETs fresh data from GET /api/products.
  // Called on mount AND after every create / update / delete mutation.
  const fetchProducts = async () => {
    try {
      console.log('[DataContext] Fetching products from backend...');
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) {
        console.error('[DataContext] GET /products failed — status', res.status);
        return;
      }
      const envelope = await res.json();
      console.log('[DataContext] Raw API response:', JSON.stringify(envelope).slice(0, 300));
      // Backend returns: { success: true, count: N, data: Product[] }
      const raw = Array.isArray(envelope) ? envelope : (envelope.data || []);
      // Normalize each product so UI components get a consistent shape
      const data = raw.map(normalizeProduct);
      console.log('[DataContext] ✅ Products synced from backend:', data.length, 'items');
      console.log('[DataContext] Sample product:', data[0] ? JSON.stringify(data[0]).slice(0, 200) : 'none');
      setProducts(data);
    } catch (err) {
      console.error('[DataContext] GET /products network error:', err.message);
    }
  };

  // Load products + orders on mount
  useEffect(() => {
    const loadInitialData = async () => {
      // Products — always from backend, never from localStorage
      await fetchProducts();

      // Orders — fetch from backend
      try {
        const ordRes = await fetch(`${API_BASE_URL}/orders`, {
          headers: getAuthHeaders()
        });
        if (ordRes.ok) {
          const ordEnvelope = await ordRes.json();
          const ordData = Array.isArray(ordEnvelope) ? ordEnvelope : (ordEnvelope.data || []);
          console.log('[DataContext] Loaded', ordData.length, 'orders from backend');
          setOrders(ordData);
        } else {
          console.error('[DataContext] GET /orders failed — status', ordRes.status);
        }
      } catch (err) {
        console.error('[DataContext] GET /orders network error:', err.message);
      }
    };

    loadInitialData();
  }, []);

  // Cache orders in localStorage as read cache
  useEffect(() => {
    localStorage.setItem('friends-florist-orders', JSON.stringify(orders));
  }, [orders]);

  // ─── Mutations — all refetch from backend after success ───────────────────────

  const addProduct = async (product) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(product)
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || `POST /products failed — status ${response.status}`);
      }
      const envelope = await response.json();
      const created = (envelope && envelope.data) ? envelope.data : envelope;
      console.log('[DataContext] ✅ Product created:', created.name || created._id || created.id);
      // Refetch full list — never trust manual array splice
      await fetchProducts();
      return created;
    } catch (err) {
      console.error('[DataContext] POST /products error:', err.message);
      throw err;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedProduct)
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || `PUT /products/${id} failed — status ${response.status}`);
      }
      const envelope = await response.json();
      const updated = (envelope && envelope.data) ? envelope.data : envelope;
      console.log('[DataContext] ✅ Product updated:', id);
      // Refetch full list — guaranteed backend state in UI
      await fetchProducts();
      return updated;
    } catch (err) {
      console.error(`[DataContext] PUT /products/${id} error:`, err.message);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    // Guard: refuse to call the API if id is missing (prevents "Cast to ObjectId failed" error)
    if (!id) {
      const msg = '[DataContext] deleteProduct called with undefined/null id — aborting DELETE request';
      console.error(msg);
      throw new Error(msg);
    }
    console.log('[DataContext] DELETE /api/products/' + id);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || `DELETE /products/${id} failed — status ${response.status}`);
      }
      console.log('[DataContext] ✅ Product deleted:', id);
      // Refetch — do not trust local filter
      await fetchProducts();
    } catch (err) {
      console.error(`[DataContext] DELETE /products/${id} error:`, err.message);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{ products, orders, addProduct, updateProduct, deleteProduct, fetchProducts }}>
      {children}
    </DataContext.Provider>
  );
};

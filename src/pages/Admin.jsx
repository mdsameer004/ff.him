import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, TrendingUp, Settings, Plus, X, Edit, Trash2 } from 'lucide-react';
import { categories } from '../data/mockData';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const { products, orders, addProduct, updateProduct, deleteProduct } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', category: categories[0], stock: '', images: '', description: ''
  });

  // Simple mock check for admin role
  if (!user || user.role !== 'admin') {
     return <Navigate to="/auth" />;
  }

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: categories[0], stock: '', images: '', description: '' });
    setShowForm(true);
  };

  const handleOpenEdit = (product) => {
    // Use _id (MongoDB ObjectId) — not the local numeric id field
    setEditingId(product._id || product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: Array.isArray(product.images) ? product.images[0] : (product.image || ''),
      description: product.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = (product) => {
    // Use _id (MongoDB ObjectId) — this is what the backend DELETE /api/products/:id expects
    const mongoId = product._id || product.id;
    if (!mongoId) {
      console.error('[Admin] handleDelete called with undefined ID — product:', product);
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      console.log('[Admin] Deleting product with _id:', mongoId);
      deleteProduct(mongoId);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: [formData.images || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800'],
      rating: 5.0,
      reviews: 0
    };

    if (editingId) {
      updateProduct(editingId, formattedData);
    } else {
      addProduct({ ...formattedData, featured: false });
    }
    setShowForm(false);
  };

  const totalRevenue = orders.reduce((acc, current) => acc + current.amount, 0);

  const renderDashboard = () => (
    <div className="admin-dashboard-grid">
      <div className="stat-card">
        <ShoppingCart className="stat-icon" />
        <div className="stat-info">
          <h4>Total Orders</h4>
          <span className="stat-value">{orders.length}</span>
        </div>
      </div>
      <div className="stat-card">
        <TrendingUp className="stat-icon" />
        <div className="stat-info">
          <h4>Revenue</h4>
          <span className="stat-value">₹{totalRevenue.toLocaleString()}</span>
        </div>
      </div>
      <div className="stat-card">
        <Package className="stat-icon" />
        <div className="stat-info">
          <h4>Products</h4>
          <span className="stat-value">{products.length}</span>
        </div>
      </div>
      <div className="stat-card">
        <Users className="stat-icon" />
        <div className="stat-info">
          <h4>Customers</h4>
          <span className="stat-value">856</span>
        </div>
      </div>

      <div className="recent-orders-sect">
        <h3>Recent Orders</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>₹{o.amount.toLocaleString()}</td>
                <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-products-view">
      <div className="section-header-admin">
        <h3>All Sales Orders</h3>
      </div>
      <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.date}</td>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>₹{o.amount.toLocaleString()}</td>
                <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                <td><button className="text-btn">View Details</button></td>
              </tr>
            ))}
          </tbody>
      </table>
    </div>
  );

  const renderProducts = () => {
    if (showForm) {
      return (
        <div className="admin-form-container">
          <div className="admin-form-header">
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <button className="icon-btn" onClick={() => setShowForm(false)}><X size={20} /></button>
          </div>
          <form className="admin-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" placeholder="https://..." value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            <div className="form-actions">
              <button type="button" className="outline-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="primary-btn">{editingId ? 'Save Changes' : 'Add Product'}</button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="admin-products-view">
        <div className="section-header-admin">
          <h3>Manage Products</h3>
          <button className="primary-btn" onClick={handleOpenAdd}><Plus size={16} style={{marginRight: '6px'}}/> Add New Product</button>
        </div>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id || p.id}>
                <td><img src={Array.isArray(p.images) ? p.images[0] : p.image} alt={p.name} className="admin-prod-img" /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{Number(p.price).toLocaleString()}</td>
                <td>{p.stock}</td>
                <td>
                  <div className="action-buttons-inline">
                    <button className="icon-btn-small" onClick={() => handleOpenEdit(p)} title="Edit"><Edit size={16}/></button>
                    <button className="icon-btn-small text-danger" onClick={() => handleDelete(p)} title="Delete"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
           <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
            <Package size={18} /> Products
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={18} /> Orders
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <Users size={18} /> Users
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>
      
      <main className="admin-main-content">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-user-info">
            <span>{user.name}</span>
            <div className="admin-avatar">{user.name.charAt(0)}</div>
          </div>
        </header>
        
        <div className="admin-content-area">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {(activeTab !== 'dashboard' && activeTab !== 'products' && activeTab !== 'orders') && (
            <div className="placeholder-content">
              <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h3>
              <p>This module is under development.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;

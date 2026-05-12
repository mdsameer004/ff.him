import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Flower2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <p>Free delivery on orders over ₹2000 | Use code: FLORAL20</p>
      </div>
      
      <div className="navbar-main">
        <div className="navbar-brand">
          <Link to="/">
            <Flower2 className="brand-icon" size={28} />
            <span className="brand-text">Friends Florist</span>
          </Link>
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <Search className="search-inner-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search for flowers, gifts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="search-submit-btn">Search</button>
        </form>

        <div className="navbar-actions">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="icon-btn desktop-only">
                  <User size={24} />
                  <span className="action-label">Admin</span>
                </Link>
              )}
              <div className="user-menu-wrapper desktop-only">
                <button onClick={logout} className="icon-btn" style={{background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0}}>
                  <User size={24} />
                  <span className="action-label">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="icon-btn desktop-only">
              <User size={24} />
              <span className="action-label">Login / Register</span>
            </Link>
          )}

          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingBag size={24} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            <span className="action-label">Cart</span>
          </Link>

          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <nav className={`navbar-categories ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink 
                to={link.path} 
                className={({isActive}) => isActive ? 'active-link' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          {user ? (
            <>
              <li>
                <NavLink 
                  to="/orders" 
                  className={({isActive}) => isActive ? 'active-link' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Orders
                </NavLink>
              </li>
              {user.role === 'admin' && (
                <li>
                  <NavLink 
                    to="/admin" 
                    className={({isActive}) => isActive ? 'active-link mobile-only-item' : 'mobile-only-item'}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </NavLink>
                </li>
              )}
              <li>
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="mobile-only-item logout-mobile-btn"
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'center', margin: 0, padding: '1rem', color: 'inherit', font: 'inherit', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink 
                to="/auth" 
                className={({isActive}) => isActive ? 'active-link mobile-only-item' : 'mobile-only-item'}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login / Register
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

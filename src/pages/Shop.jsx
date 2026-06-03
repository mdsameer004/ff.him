import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Star } from 'lucide-react';
import { categories } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import './Shop.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  // Support both `images[]` (backend) and `image` (legacy mock) field shapes
  const imageUrl = (Array.isArray(product.images) && product.images[0])
    ? product.images[0]
    : (product.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800');
  // Use MongoDB _id as primary key/route param, fallback to numeric id
  const productId = product._id || product.id;

  return (
    <div className="shop-product-card">
      <div className="shop-product-image">
        <Link to={`/product/${productId}`} style={{display: 'block', height: '100%'}}>
          <img src={imageUrl} alt={product.name} />
        </Link>
        <button className="shop-add-btn" onClick={(e) => { e.preventDefault(); addToCart(product); }}>Add to Cart</button>
      </div>
      <div className="shop-product-info">
        <span className="shop-product-cat">{product.category}</span>
        <Link to={`/product/${productId}`} style={{color: 'inherit', textDecoration: 'none'}}>
          <h4>{product.name}</h4>
        </Link>
        <div className="shop-product-rating">
          <Star size={14} fill="var(--accent)" color="var(--accent)"/>
          <span>{product.rating || 0}</span>
        </div>
        <div className="shop-product-price">₹{Number(product.price).toLocaleString()}</div>
      </div>
    </div>
  );
};

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initCategory = searchParams.get('category') || 'All';
  const initSearch = searchParams.get('search') || '';

  const { products } = useData();
  // Start empty — useEffect below re-filters whenever context `products` updates
  const [displayProducts, setDisplayProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initCategory);
  const [searchQuery, setSearchQuery] = useState(initSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(5000);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let filtered = [...products];

    // Category Filter
    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search Filter
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Price Filter
    filtered = filtered.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setDisplayProducts(filtered);
  }, [activeCategory, searchQuery, priceRange, sortBy, products]);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Shop Our Collection</h1>
        <p>Premium floral arrangements and gifts for every occasion.</p>
      </div>

      <div className="shop-layout">
        <button className="mobile-filter-btn" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
          <Filter size={18} /> Filters
        </button>

        <aside className={`shop-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
          <div className="filter-group">
            <h3>Search</h3>
            <div className="sidebar-search">
              <input 
                type="text" 
                placeholder="Find exactly..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="search-icon" />
            </div>
          </div>

          <div className="filter-group">
            <h3>Categories</h3>
            <ul className="category-list">
              <li 
                className={activeCategory === 'All' ? 'active' : ''} 
                onClick={() => setActiveCategory('All')}
              >
                All Arrangements
              </li>
              {categories.map(cat => (
                <li 
                  key={cat} 
                  className={activeCategory === cat ? 'active' : ''}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h3>Max Price: ₹{priceRange}</h3>
            <input 
              type="range" 
              className="price-slider"
              min="500" 
              max="5000" 
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
          </div>
        </aside>

        <div className="shop-main">
          <div className="shop-controls">
            <span>Showing {displayProducts.length} results</span>
            <div className="sort-control">
              <SlidersHorizontal size={16} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {displayProducts.length > 0 ? (
            <div className="shop-grid">
              {displayProducts.map(product => (
                // Use _id (MongoDB) with fallback to numeric id for unique React keys
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                  setPriceRange(5000);
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;

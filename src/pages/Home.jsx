import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { bannerOffers, categories } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import './Home.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  // Support both `images[]` (backend) and `image` (legacy mock) field shapes
  const imageUrl = (Array.isArray(product.images) && product.images[0])
    ? product.images[0]
    : (product.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800');
  const productId = product._id || product.id;

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <Link to={`/product/${productId}`} style={{display: 'block', height: '100%'}}>
          <img src={imageUrl} alt={product.name} />
        </Link>
        <button className="add-to-cart-btn" onClick={(e) => { e.preventDefault(); addToCart(product); }}>
          Add to Cart
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${productId}`} style={{color: 'inherit', textDecoration: 'none'}}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="product-rating">
          <Star size={14} fill="var(--accent)" color="var(--accent)" />
          <span>{product.rating || 0} ({product.reviews || 0})</span>
        </div>
        <div className="product-price">₹{Number(product.price).toLocaleString()}</div>
      </div>
    </div>
  );
};

const Home = () => {
  const { products } = useData();
  const primaryBanner = bannerOffers[0];
  // Featured products: prefer products with featured=true flag.
  // MongoDB backend products may not have this field — fall back to first 4 products.
  const featuredProducts = products.filter(p => p.featured).length > 0
    ? products.filter(p => p.featured)
    : products.slice(0, 4);

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section 
        className="hero-section" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${primaryBanner.bgImage})` }}
      >
        <div className="hero-content">
          <span className="hero-subtitle">Premium Floral Designs</span>
          <h1 className="hero-title">{primaryBanner.title}</h1>
          <p className="hero-desc">{primaryBanner.subtitle}</p>
          <Link to="/shop" className="primary-btn">
            {primaryBanner.cta} <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/shop" className="view-all-link">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="categories-grid">
          {categories.slice(0, 4).map((cat, index) => (
            <Link to={`/shop?category=${cat}`} className="category-card" key={index}>
              <div className="category-content">
                <h3>{cat}</h3>
                <span>Explore &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Arrangements</h2>
          <p>Hand-picked, premium selections for your special moments.</p>
        </div>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Secondary Banner */}
      <section className="secondary-banner">
        <div className="sb-content">
          <h2>{bannerOffers[1].title}</h2>
          <p>{bannerOffers[1].subtitle}</p>
          <Link to="/gallery" className="outline-btn">{bannerOffers[1].cta}</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

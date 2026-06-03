import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Truck, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useData();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Match by MongoDB _id (string) first, then fall back to legacy numeric id
    const found = products.find(p =>
      String(p._id) === String(id) || String(p.id) === String(id)
    );
    console.log('[ProductDetails] Looking for id:', id, '| Found:', found?.name || 'NOT FOUND');
    if (found) setProduct(found);
  }, [id, products]);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button className="primary-btn" onClick={() => navigate('/shop')}>Return to Shop</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    // Optional: show a toast or feedback here
  };

  return (
    <div className="pd-container">
      <Link to="/shop" className="back-link">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="pd-layout">
        <div className="pd-image-col">
          <div className="pd-main-img">
            {/* Support both images[] array (backend) and image string (legacy) */}
            <img
              src={(Array.isArray(product.images) && product.images[0]) ? product.images[0] : (product.image || '')}
              alt={product.name}
            />
          </div>
          {/* If there were multiple thumbnails, they would go here */}
        </div>

        <div className="pd-info-col">
          <span className="pd-category">{product.category}</span>
          <h1 className="pd-title">{product.name}</h1>
          
          <div className="pd-rating">
            <div className="stars">
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
              <Star size={16} fill="var(--accent)" color="var(--accent)" />
            </div>
            <span className="rating-text">{product.rating || 0} ({product.reviews || 0} reviews)</span>
          </div>

          <div className="pd-price">₹{Number(product.price).toLocaleString()}</div>
          
          <p className="pd-desc">{product.description}</p>

          <div className="pd-actions">
            <div className="pd-qty-wrap">
              <span className="qty-label">Quantity:</span>
              <div className="quantity-selector">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              </div>
            </div>

            <div className="pd-btn-group">
              <button className="primary-btn pd-add-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="icon-action-btn">
                <Heart size={20} />
              </button>
            </div>
          </div>

          <div className="pd-features">
            <div className="feature-item">
              <Truck size={20} />
              <div>
                <h5>Free Same-Day Delivery</h5>
                <p>Order before 2 PM for same-day delivery in Rose City.</p>
              </div>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} />
              <div>
                <h5>Freshness Guarantee</h5>
                <p>Our blooms are guaranteed fresh for at least 7 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

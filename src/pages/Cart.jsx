import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const tax = 0; // Tax removed
  const shipping = subtotal > 2000 ? 0 : 150; // Free shipping over 2000
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setIsCheckingOut(true);
    
    // Mock checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="cart-container empty">
        <div className="empty-cart-msg">
          <ShieldCheck size={64} color="var(--primary)" />
          <h2>Order Confirmed!</h2>
          <p>Thank you for shopping with Friends Florist. Your premium arrangement is being prepared.</p>
          <p className="order-number-mock">Order ID: #{Math.floor(100000 + Math.random() * 900000)}</p>
          <Link to="/orders" className="primary-btn mt-3">View Orders</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container empty">
        <div className="empty-cart-msg">
          <ShoppingBag size={64} className="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any beautiful arrangements yet.</p>
          <Link to="/shop" className="primary-btn mt-3">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart ({totalItems} Items)</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items-section">
          {cart.map((item) => (
            <div className="cart-item" key={item.product.id}>
              <div className="item-image">
                <img src={item.product.images[0]} alt={item.product.name} />
              </div>
              
              <div className="item-details">
                <div className="item-header">
                  <h3>{item.product.name}</h3>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <p className="item-category">{item.product.category}</p>
                <div className="item-price">₹{item.product.price.toLocaleString()}</div>
                
                <div className="item-actions">
                  <div className="quantity-selector">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="item-line-total">
                    Total: ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>{shipping === 0 ? <span className="free-text">Free</span> : `₹${shipping}`}</span>
            </div>

            <hr />
            
            <div className="summary-row total">
              <span>Total Address</span>
              <span>₹{total.toFixed(0)}</span>
            </div>

            <button 
              className="checkout-btn" 
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing Payment...' : 'Proceed to Checkout'} 
              {!isCheckingOut && <ArrowRight size={18} />}
            </button>
            
            <div className="secure-checkout">
              <ShieldCheck size={16} /> Secure Checkout Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

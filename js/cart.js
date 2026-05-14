// Cart State Management
let cart = JSON.parse(localStorage.getItem('friendsFloristCart')) || [];

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('friendsFloristCart', JSON.stringify(cart));
    updateCartBadge();
}

// Add Item to Cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    saveCart();
    
    // Optional: Show toast notification
    showToast(`${product.name} added to cart!`, 'success', 'Added to Cart');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    // Re-render cart if on cart page
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            if (window.location.pathname.includes('cart.html')) {
                renderCartPage();
            }
        }
    }
}

// Calculate Totals
function getCartSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartTotal() {
    const subtotal = getCartSubtotal();
    const tax = subtotal * 0.05; // 5% mock tax
    const delivery = subtotal > 1000 ? 0 : 99; // Free delivery over ₹1000
    return {
        subtotal,
        tax,
        delivery,
        total: subtotal + tax + delivery
    };
}

// Update Cart Badge in Navbar
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', updateCartBadge);

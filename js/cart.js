// Cart State Management
let cart = JSON.parse(localStorage.getItem('friendsFloristCart')) || [];

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('friendsFloristCart', JSON.stringify(cart));
    updateCartBadge();
}

// ─── Resolve the canonical ID for a product ─────────────────────────────────
// Backend products use _id (MongoDB string), legacy/local products use numeric id.
// We store a unified `cartId` in each cart item so lookups always work.
function getProductId(product) {
    return product._id || product.id || null;
}

// Add Item to Cart
function addToCart(productId, quantity = 1) {
    // productId may be a MongoDB _id string or a numeric id
    const product = (window.products || []).find(p =>
        String(p._id) === String(productId) ||
        String(p.id)  === String(productId)
    );

    if (!product) {
        console.warn('[Cart] Product not found for id:', productId);
        showToast('Product not found. Please refresh and try again.', 'error', 'Error');
        return;
    }

    // Enforce stock check
    const maxQty = product.stock > 0 ? product.stock : Infinity;

    // Use a stable cartId (prefer _id from MongoDB)
    const cartId = getProductId(product);

    const existingItem = cart.find(item => String(item.cartId) === String(cartId));
    if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        existingItem.quantity = Math.min(newQty, maxQty);
    } else {
        cart.push({
            cartId,             // unified lookup key (could be _id string or number)
            _id: product._id || null,
            id: product.id || null,
            name: product.name,
            price: product.price,
            image: product.image || (Array.isArray(product.images) && product.images[0]) || '',
            stock: product.stock,
            quantity: Math.min(quantity, maxQty)
        });
    }

    saveCart();
    showToast(`${product.name} added to cart!`, 'success', 'Added to Cart');
}

// Remove from Cart
function removeFromCart(cartId) {
    cart = cart.filter(item => String(item.cartId) !== String(cartId));
    saveCart();
    // Re-render cart if on cart page
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// Update Quantity
function updateQuantity(cartId, change) {
    const item = cart.find(item => String(item.cartId) === String(cartId));
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(cartId);
        } else {
            // Respect stock limit
            if (item.stock && item.quantity > item.stock) {
                item.quantity = item.stock;
                showToast(`Only ${item.stock} units available.`, 'info', 'Stock Limit');
            }
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
    const tax = 0; // Tax removed
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

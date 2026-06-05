const fallbackImage = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&h=800&auto=format&fit=crop";

/* ---------- Cache helpers (5-minute TTL) ---------- */
const CACHE_KEY = 'ff_products_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms

function getCachedProducts() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL) return null; // expired
        return Array.isArray(data) && data.length > 0 ? data : null;
    } catch (e) { return null; }
}

function setCachedProducts(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    } catch (e) { /* storage full — ignore */ }
}

/* ---------- Background wake-up ping (Render cold-start fix) ---------- */
// Pings the backend silently as soon as this script loads so the server
// is warm by the time the real /products fetch fires.
(function pingBackend() {
    const BASE = (typeof window.API_BASE_URL !== 'undefined')
        ? window.API_BASE_URL
        : 'https://floristbackend.onrender.com/api';
    fetch(BASE + '/health', { method: 'GET', cache: 'no-store' })
        .catch(() => { /* server still asleep — main fetch will wait */ });
})();

/* ---------------- REVIEWS ---------------- */

const getProductReviews = (productId) => {
    const allReviews = JSON.parse(localStorage.getItem('friendsFloristReviews')) || {};
    return allReviews[productId] || [
        { name: "Jane D.", rating: 5, text: "Perfect quality! Arrived exactly when expected.", date: "2026-03-01" },
        { name: "Mark T.", rating: 4, text: "Beautiful arrangement, very fresh.", date: "2026-02-28" }
    ];
};

const calculateAverageRating = (productId) => {
    const reviews = getProductReviews(productId);
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
};

/* ---------------- PRODUCTS STATE ---------------- */

window.products = [];
let _onProductsLoaded = null;

/* ---------------- CALLBACK REGISTRATION ---------------- */

window.onProductsLoaded = function(callback) {
    _onProductsLoaded = callback;
    if (window.products.length > 0) callback(window.products);
};

/* ---------------- LOAD PRODUCTS FROM BACKEND ---------------- */

window.loadProducts = async function(skipCache = false) {
    // ── Serve from cache if fresh ─────────────────────────────────────────────
    if (!skipCache) {
        const cached = getCachedProducts();
        if (cached) {
            window.products = cached;
            if (typeof _onProductsLoaded === 'function') {
                _onProductsLoaded(window.products);
            }
            console.log('⚡ Products from cache:', cached.length);
            // Still refresh in the background so cache stays warm
            setTimeout(() => window.loadProducts(true), 100);
            return window.products;
        }
    }

    // ── Fetch from network ────────────────────────────────────────────────────
    try {
        const BASE = (typeof window.API_BASE_URL !== 'undefined')
            ? window.API_BASE_URL
            : 'https://floristbackend.onrender.com/api';

        const res = await fetch(BASE + '/products');

        if (res.ok) {
            const envelope = await res.json();
            const data = Array.isArray(envelope) ? envelope : (envelope.data || []);

            window.products = data;
            setCachedProducts(data); // store for next visit

            if (typeof _onProductsLoaded === 'function') {
                _onProductsLoaded(window.products);
            }

            console.log('🟢 Products loaded from network:', data.length);
            return window.products;
        }
    } catch (err) {
        console.error('❌ Product load failed:', err);
        // If network fails, try showing stale cache rather than nothing
        const stale = getCachedProducts();
        if (!stale) {
            const raw = localStorage.getItem(CACHE_KEY);
            if (raw) {
                try {
                    const { data } = JSON.parse(raw);
                    if (Array.isArray(data) && data.length > 0) {
                        window.products = data;
                        if (typeof _onProductsLoaded === 'function') _onProductsLoaded(window.products);
                    }
                } catch (e) { /* ignore */ }
            }
        }
    }

    return window.products;
};

/* ---------------- REAL-TIME AUTO REFRESH FIX ---------------- */

// initial load
window.loadProducts();

// AUTO REFRESH every 30 seconds
setInterval(() => {
    window.loadProducts();
}, 30000);

/* ---------------- PRODUCT CARD UI ---------------- */

function createModernProductCard(product) {
    const avgRating = calculateAverageRating(product.id);
    const revCount = getProductReviews(product.id).length;
    const stars = '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating));
    const imageUrl = product.image ? product.image : fallbackImage;

    const priceNum = Number(product.price) || 0;
    const originalPriceNum = Number(product.original_price) || 0;

    const discount = (originalPriceNum > priceNum)
        ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
        : 0;

    const discountBadge = discount > 0
        ? `<div class="modern-discount-badge">-${discount}%</div>`
        : '';

    const originalPriceHTML = (originalPriceNum > priceNum)
        ? `<span class="price-original">₹${originalPriceNum.toLocaleString('en-IN')}</span>`
        : '';

    const priceSaleHTML = `<span class="price-sale">₹${priceNum.toLocaleString('en-IN')}</span>`;

    const productId = product._id || product.id;

    return `
        <div class="modern-product-card" data-id="${productId}"
            onclick="window.location.href='product.html?id=${productId}'">

            <div class="modern-image-container">
                <img src="${imageUrl}" class="modern-product-image"
                    onerror="this.src='${fallbackImage}'">

                <div class="modern-product-rating-overlay">
                    ${stars} <span>(${revCount})</span>
                </div>

                ${discountBadge}
            </div>

            <div class="modern-product-info">
                <h3>${product.name}</h3>

                <div class="modern-product-price">
                    ${originalPriceHTML}
                    ${priceSaleHTML}
                </div>

                <button class="modern-add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${productId}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}
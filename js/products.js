const fallbackImage = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&h=800&auto=format&fit=crop";

// Initialize/Load Reviews from LocalStorage
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

const defaultProducts = [
    {
        id: 1,
        name: "rose lily bouquet",
        category: "Anniversary Flowers",
        original_price: 1499,
        price: 1199,
        rating: 5,
        stock: 12,
        deliveryInfo: "Same day delivery available for orders before 2 PM.",
        image: "images/rose-lily-bouquet.jpg",
        description: "A timeless arrangement of premium pink roses, expertly hand-tied for that perfect romantic gesture."
    },
    {
        id: 2,
        name: "Cash & Roses",
        category: "Birthday Bouquets",
        original_price: 3999,
        price: 2999,
        rating: 4.7,
        stock: 21,
        deliveryInfo: "Same day delivery available.",
        image: "images/cash-and-roses.png",
        description: "comes with 2100 rupees,Celebrate milestones, new beginnings, and prosperity with a gift that truly stands out. The Fortune & Flora Luxury Bouquet seamlessly blends the timeless elegance of premium white roses and soft hydrangeas with a stunning, artfully arranged display of currency. Housed in a sleek, minimalist matte black box, this high-impact arrangement is the ultimate statement piece for corporate milestones, weddings, festivals, and monumental celebrations."
    },
    {
        id: 3,
        name: "Chocolate & Roses",
        category: "Birthday Bouquets",
        original_price: 1499,
        price: 1199,
        rating: 4.6,
        stock: 15,
        deliveryInfo: "Will be delivered today.",
        image: "images/chocolate-and-roses.png",
        description: "Indulge their sweet tooth and capture their heart all at once. The Sweet Romance Bouquet is a spectacular, high-impact gifting arrangement that beautifully pairs the classic elegance of fresh red roses with an absolute treasure trove of premium chocolates. Expertly wrapped in soft pink premium tissue layers and tied with a satin bow, it's the ultimate gesture for birthdays, anniversaries, Valentine's Day, or 'just because.' Chocolates included: Cadbury Dairy Milk Silk Oreo, Galaxy Smooth Milk, Nestlé KitKat / KitKat Chunky, Cadbury 5 Star, and Cadbury Dairy Milk."
    },
    {
        id: 4,
        name: "Prestige Floral Edition",
        category: "Anniversary Flowers",
        original_price: 1599,
        price: 1199,
        rating: 4.7,
        stock: 25,
        deliveryInfo: "Premium courier delivery.",
        image: "images/prestige-floral-edition.png",
        description: "A grand and luxurious floral arrangement designed to leave a lasting impression. The Prestige Floral Edition showcases an exquisite blend of premium red roses, elegant white lilies, vibrant purple alstroemeria, delicate baby's breath, and lush white chrysanthemums. Expertly arranged with fresh seasonal greenery, this bouquet offers a perfect balance of color, texture, and sophistication. Wrapped in premium black-and-gold designer paper and finished with a graceful satin ribbon, this statement bouquet embodies elegance, celebration, and heartfelt emotions. Contents: Premium Red Roses, White Lilies, Purple Alstroemeria, White Chrysanthemums, Baby's Breath (Gypsophila), Fresh Seasonal Foliage. Perfect for anniversaries, birthdays, congratulations, grand celebrations, thank you gifts, and special occasions."
    },
    {
        id: 5,
        name: "The Teddy & Roses Collection",
        category: "Birthday Bouquets",
        original_price: 1699,
        price: 1299,
        stock: 10,
        deliveryInfo: "Standard shipping times apply.",
        rating: 4.9,
        image: "images/teddy-and-roses.png",
        description: "A heartwarming blend of elegance and affection. The Teddy & Roses Collection features a luxurious arrangement of premium white roses beautifully paired with a soft plush teddy bear. Delicate baby's breath and fresh greenery enhance the arrangement, creating a timeless display of purity, love, and warmth. Presented in a sophisticated black hat box, this charming floral gift combines the beauty of fresh flowers with a cuddly keepsake. Contents: Premium White Roses, Baby's Breath (Gypsophila), Fresh Seasonal Greenery, Soft Plush Teddy Bear, Luxury Black Hat Box. Perfect for birthdays, anniversaries, and all special occasions."
    },
    {
        id: 6,
        name: "Sunset Symphony Bouquet",
        category: "Premium Bouquets",
        original_price: 1499,
        price: 999,
        stock: 20,
        deliveryInfo: "Bulk delivery options available.",
        rating: 5,
        image: "images/sunset-symphony.png",
        description: "A stunning floral masterpiece inspired by the warm hues of a sunset. The Sunset Symphony Bouquet brings together a vibrant blend of premium flowers — radiant sunflowers, passionate red roses, delicate pink blooms, graceful orange gladiolus, and airy baby's breath — in a harmonious display of color and elegance. Expertly arranged with fresh seasonal greenery and wrapped in elegant designer paper. Contents: Premium Red Roses, Bright Sunflowers, Orange Gladiolus, Pink Seasonal Blooms, Baby's Breath (Gypsophila), Fresh Seasonal Greenery, Premium Designer Wrapping. Perfect for birthdays, anniversaries, congratulations, graduations, thank you gifts, and special occasions. 🌻🌹✨"
    },
    {
        id: 7,
        name: "The Gentleman's Prestige Hamper",
        category: "Premium Bouquets",
        original_price: 800,
        price: 600,
        stock: 25,
        deliveryInfo: "Same day delivery in specific zones.",
        rating: 4.1,
        image: "images/gentlemans-prestige-hamper.png",
        description: "A customized luxury gift hamper designed to transform your selected gifts into an elegant presentation. Our team will carefully arrange your preferred items in a premium wicker basket, enhanced with fresh flowers, decorative fillers, and stylish finishing touches. Featuring fresh red roses, delicate baby's breath, and professional hamper styling, this arrangement turns everyday gifts into a memorable and sophisticated gifting experience. What's Included: Premium Wicker Gift Basket, Fresh Red Roses, Baby's Breath (Gypsophila), Decorative Fillers & Greenery, Professional Hamper Arrangement, Elegant Gift Presentation. Customer Should Provide: Grooming Products, Perfumes & Fragrances, Clothing & Accessories, Chocolates & Snacks, Personalized Gifts, or Any Other Gift Items. Note: Items shown inside the hamper are for display purposes only. 🎁🌹✨"
    },
    {
        id: 8,
        name: "Luxury Wedding Bouquet",
        category: "Wedding Decorations",
        original_price: 1599,
        price: 1199,
        stock: 4,
        deliveryInfo: "Hand-delivery by specialist florist.",
        rating: 4.8,
        image: "https://plus.unsplash.com/premium_photo-1664790560495-d4c3052c35fb?q=80&w=800&h=800&auto=format&fit=crop",
        description: "Stunning pure white elegant wedding bouquet, designed to accompany you on your most beautiful day."
    }
];


function createModernProductCard(product) {
    const avgRating = calculateAverageRating(product.id);
    const revCount = getProductReviews(product.id).length;
    const stars = '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating));
    const imageUrl = product.image ? product.image : fallbackImage;

    // Defensive pricing safeguards
    const priceNum = typeof product.price === 'number' && !isNaN(product.price)
        ? product.price
        : parseFloat(product.price || 0) || 0;

    const originalPriceNum = typeof product.original_price === 'number' && !isNaN(product.original_price)
        ? product.original_price
        : (product.original_price ? parseFloat(product.original_price) || 0 : 0);

    const discount = (originalPriceNum > priceNum && originalPriceNum > 0)
        ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
        : 0;

    const discountBadge = discount > 0
        ? `<div class="modern-discount-badge">-${discount}%</div>`
        : '';

    const originalPriceHTML = (originalPriceNum > priceNum && originalPriceNum > 0)
        ? `<span class="price-original">₹${originalPriceNum.toLocaleString('en-IN')}</span>`
        : '';

    const priceSaleHTML = `<span class="price-sale">₹${priceNum.toLocaleString('en-IN')}</span>`;

    return `
        <div class="modern-product-card" data-id="${product.id}" onclick="window.location.href='product.html?id=${product.id}'" style="cursor: pointer;">
            <div class="modern-image-container">
                <img src="${imageUrl}" class="modern-product-image" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}';">
                <div class="modern-product-rating-overlay">${stars} <span style="font-size: 0.75rem;">(${revCount})</span></div>
                ${discountBadge}
                ${typeof heartButtonHTML === 'function' ? heartButtonHTML(product.id) : ''}
            </div>
            <div class="modern-product-info">
                <h3 class="modern-product-title">${product.name}</h3>
                <div class="modern-product-price">
                    ${originalPriceHTML}
                    ${priceSaleHTML}
                </div>
                <button class="modern-add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
}
const PRODUCTS_VERSION = "3.0"; // Bumped — now API-first, no localStorage render cache

// Start with empty array — will be populated async from backend
window.products = [];
let _onProductsLoaded = null; // callback registered by page scripts

/**
 * Register a callback to be fired when products are loaded from the API.
 * Pages call this before DOMContentLoaded so they re-render after data arrives.
 */
window.onProductsLoaded = function(callback) {
    _onProductsLoaded = callback;
    // If products are already loaded (e.g. second call), fire immediately
    if (window.products.length > 0) callback(window.products);
};

/**
 * Loads products from the live backend API.
 * Falls back to defaultProducts only if the network is completely unreachable.
 */
window.loadProducts = async function() {
    // 1. Try live backend via apiClient (unwraps envelope for us)
    if (window.apiClient) {
        try {
            const data = await window.apiClient.getProducts();
            console.log('[products.js] ✅ Products loaded from API:', data.length, 'items', data);
            window.products = data;
            if (typeof _onProductsLoaded === 'function') _onProductsLoaded(window.products);
            return window.products;
        } catch (e) {
            console.error('[products.js] apiClient.getProducts() failed:', e.message);
        }
    }

    // 2. Direct fetch fallback (if apiClient not loaded)
    try {
        const BASE = (typeof window.API_BASE_URL !== 'undefined')
            ? window.API_BASE_URL
            : 'https://floristbackend.onrender.com/api';
        console.log('[products.js] Fetching directly from', BASE + '/products');
        const res = await fetch(BASE + '/products');
        if (res.ok) {
            const envelope = await res.json();
            console.log('[products.js] Raw API response:', envelope);
            // Backend returns { success, count, data: Product[] }
            const data = Array.isArray(envelope) ? envelope : (envelope.data || []);
            console.log('[products.js] ✅ Products loaded via direct fetch:', data.length, 'items');
            window.products = data;
            if (typeof _onProductsLoaded === 'function') _onProductsLoaded(window.products);
            return window.products;
        } else {
            console.error('[products.js] GET /products failed — status', res.status);
        }
    } catch (e) {
        console.error('[products.js] Direct fetch failed:', e.message);
    }

    // 3. Last resort: hardcoded defaults (offline / cold start failure)
    console.warn('[products.js] All API attempts failed — using defaultProducts fallback');
    window.products = defaultProducts;
    if (typeof _onProductsLoaded === 'function') _onProductsLoaded(window.products);
    return window.products;
};

// Kick off async load immediately on script parse
window.loadProducts().catch(err => console.error('[products.js] loadProducts error:', err));

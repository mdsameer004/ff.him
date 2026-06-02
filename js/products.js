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
        name: "Anniversary Special Bouquet",
        category: "Anniversary Flowers",
        original_price: 1199,
        price: 849,
        rating: 4.7,
        stock: 5,
        deliveryInfo: "Premium courier delivery.",
        image: "https://images.unsplash.com/photo-1729151634645-1f4ed2938f0b?q=80&w=800&h=800&auto=format&fit=crop",
        description: "A premium arrangement of orchids and lilies, designed for those truly special milestones."
    },
    {
        id: 5,
        name: "Spring Garden Bouquet",
        category: "Birthday Bouquets",
        original_price: 999,
        price: 749,
        stock: 10,
        deliveryInfo: "Standard shipping times apply.",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&h=800&auto=format&fit=crop",
        description: "Gorgeous ruffled peonies and seasonal flowers that bring the beauty of spring indoors."
    },
    {
        id: 6,
        name: "Elegant Mixed Flower Bouquet",
        category: "Premium Bouquets",
        original_price: 849,
        price: 599,
        stock: 20,
        deliveryInfo: "Bulk delivery options available.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1699830008232-fe4ae2a6ee11?q=80&w=800&h=800&auto=format&fit=crop",
        description: "A thoughtful mix of seasonal blooms, perfect for corporate events or home decor."
    },
    {
        id: 7,
        name: "Premium Rose Basket",
        category: "Premium Bouquets",
        original_price: 1299,
        price: 949,
        stock: 6,
        deliveryInfo: "Same day delivery in specific zones.",
        rating: 4.1,
        image: "https://plus.unsplash.com/premium_photo-1674197235302-1190e266fd04?q=80&w=800&h=800&auto=format&fit=crop",
        description: "Premium florist style fresh roses artfully arranged in a rustic hand-woven basket."
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
const PRODUCTS_VERSION = "2.1"; // Bump this to force a localStorage refresh

let products;
try {
    const storedVersion = localStorage.getItem('products_version');
    const stored = localStorage.getItem('products');

    // If version mismatch or no data, reset from defaultProducts
    if (storedVersion !== PRODUCTS_VERSION || !stored) {
        products = defaultProducts;
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        localStorage.setItem('products_version', PRODUCTS_VERSION);
        console.log('Products cache refreshed to version', PRODUCTS_VERSION);
    } else {
        products = JSON.parse(stored);
        if (!Array.isArray(products) || products.length === 0) {
            products = defaultProducts;
            localStorage.setItem('products', JSON.stringify(defaultProducts));
        }
    }
} catch (e) {
    console.error("Safeguard: Failed to parse products from localStorage, falling back to default.", e);
    products = defaultProducts;
}

window.products = products;
console.log('Products loaded synchronously:', window.products.length);

window.loadProducts = async function () {
    if (window.apiClient) {
        try {
            window.products = await window.apiClient.getProducts();
            console.log('Products loaded asynchronously via API:', window.products.length);
            return window.products;
        } catch (e) {
            console.warn('API getProducts failed, using localStorage fallback:', e);
        }
    }
    return window.products;
};

// Auto-run if apiClient is available on the window
if (window.apiClient) {
    window.loadProducts().catch(err => console.error("Error auto-loading products:", err));
}

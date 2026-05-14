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

const products = [
    {
        id: 1,
        name: "Classic Red Rose Bouquet",
        category: "Anniversary Flowers",
        original_price: 699,
        price: 499,
        rating: 5,
        stock: 12,
        deliveryInfo: "Same day delivery available for orders before 2 PM.",
        image: "https://images.unsplash.com/photo-1767824122857-9a1521db58d3?q=80&w=800&h=800&auto=format&fit=crop",
        description: "A timeless arrangement of premium red roses, expertly hand-tied for that perfect romantic gesture."
    },
    {
        id: 2,
        name: "Romantic Love Bouquet",
        category: "Anniversary Flowers",
        original_price: 799,
        price: 549,
        rating: 4.8,
        stock: 8,
        deliveryInfo: "Next day delivery available.",
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&h=800&auto=format&fit=crop",
        description: "Soft pink roses and delicate baby's breath create a truly enchanting atmosphere."
    },
    {
        id: 3,
        name: "Birthday Celebration Bouquet",
        category: "Birthday Bouquets",
        original_price: 899,
        price: 649,
        rating: 4.9,
        stock: 15,
        deliveryInfo: "Free standard delivery.",
        image: "https://images.unsplash.com/photo-1667489024245-7beb09ac43c5?q=80&w=800&h=800&auto=format&fit=crop",
        description: "A joyful mix of colorful tulips and peonies to celebrate another wonderful year."
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
        category: "Event Decorations",
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
        category: "Event Decorations",
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
    const discount = product.original_price > product.price 
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
        : 0;
    const discountBadge = discount > 0 
        ? `<div class="modern-discount-badge">-${discount}%</div>` 
        : '';
    
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
                    <span class="price-original">₹${product.original_price.toLocaleString('en-IN')}</span>
                    <span class="price-sale">₹${product.price.toLocaleString('en-IN')}</span>
                </div>
                <button class="modern-add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
}
window.products = products;
console.log('Products loaded:', window.products.length);

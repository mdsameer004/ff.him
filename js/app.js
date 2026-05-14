// Shared UI Components and Initialization

const navbarHTML = `
<nav class="navbar">
    <div class="navbar-container">
        <a href="index.html" class="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-dark-green)" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 4 16 4 9C4 5.5 6.5 3 10 3C11.5 3 12.8 3.8 13.5 4.8C14.2 3.8 15.5 3 17 3C20.5 3 23 5.5 23 9C23 16 15 22 15 22H12Z"/>
            </svg>
            Friends <span>Florist</span>
        </a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="shop.html">Shop</a>
            <a href="gallery.html">Gallery</a>
            <a href="contact.html">Contact</a>
            <a href="orders.html">My Orders</a>
            <a href="wishlist.html" class="mobile-only-wishlist">❤️ Wishlist</a>
            <a href="auth.html" class="mobile-only-login">Login / Register</a>
        </div>
        <div class="nav-actions">
            <div class="nav-search-btn" id="search-btn" title="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
            <a href="auth.html" class="login-icon" title="Login / Register">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </a>
            <a href="wishlist.html" class="wishlist-nav-icon" title="Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
                <span class="wishlist-badge">0</span>
            </a>
            <a href="cart.html" class="nav-icon">
                🛒
                <span class="cart-badge">0</span>
            </a>
            <div class="mobile-menu-btn">☰</div>
        </div>
    </div>
    <div class="search-container" id="search-bar">
        <div class="search-box">
            <input type="text" placeholder="Search flowers, bouquets, categories..." id="search-input">
            <button onclick="performSearch()">Search</button>
        </div>
    </div>
</nav>
`;

const footerHTML = `
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-col">
                <h4>Friends Florist</h4>
                <p>Bringing nature's elegance to your doorstep since 1999. We specialize in premium floral arrangements for all occasions.</p>
            </div>
            <div class="footer-col">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="shop.html">Shop All</a></li>
                    <li><a href="gallery.html">Event Gallery</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Customer Service</h4>
                <ul>
                    <li><a href="delivery.html">Delivery Info</a></li>
                    <li><a href="returns.html">Returns & Refunds</a></li>
                    <li><a href="faq.html">FAQs</a></li>
                    <li><a href="privacy.html">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Contact Info</h4>
                <p>📍 Opp Lenscart,3-5, Main Rd,
Himayatnagar, Hyderabad, Telangana 500029</p>
                <p>📞 +91 97039 65734</p>
                <p>✉️ friendsflorist@gmail.com</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Friends Florist. All rights reserved.</p>
        </div>
    </div>
</footer>
`;

// Insert UI Components
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('navbar-container');
    const footerContainer = document.getElementById('footer-container');
    
    if (navContainer) navContainer.innerHTML = navbarHTML;
    if (footerContainer) footerContainer.innerHTML = footerHTML;

    // Initialize UI Interactions
    initInteractions();
    
    // Page specific initializations
    initHomePage();
    
    // Ensure cart badge is correct after DOM loads our new navbar
    setTimeout(() => { if(typeof updateCartBadge === 'function') updateCartBadge(); }, 100);
});

function initInteractions() {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Search Toggle
    const searchBtn = document.getElementById('search-btn');
    const searchBar = document.getElementById('search-bar');
    
    if (searchBtn && searchBar) {
        searchBtn.addEventListener('click', () => {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                document.getElementById('search-input').focus();
            }
        });
    }

    // Highlight current nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function performSearch() {
    const query = document.getElementById('search-input').value;
    if (query) {
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
}

// Home Page Specific Logic
function initHomePage() {
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') return;

    // Populate Categories (derived from products)
    const categoriesSet = new Set(products.map(p => p.category));
    const categoriesSection = document.getElementById('home-categories');
    
    if (categoriesSection) {
        let catHTML = '';
        const images = [
            "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=400", // Wedding
            "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400", // Anniversary
            "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400", // Birthday
            "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400"  // Event
        ];
        
        Array.from(categoriesSet).slice(0, 4).forEach((category, idx) => {
            catHTML += `
                <a href="shop.html?category=${encodeURIComponent(category)}" class="category-card" style="text-align: center; display: block; text-decoration: none;">
                    <div style="width: 100%; max-width: 200px; aspect-ratio: 1/1; border-radius: 50%; overflow: hidden; margin: 0 auto 15px auto; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <img src="${images[idx] || products[0].image}" alt="${category}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    </div>
                    <h3 style="font-size: 1.1rem; color: var(--color-dark-green); margin: 0;">${category}</h3>
                </a>
            `;
        });
        
        // Add minimal layout CSS dynamically for category grid
        categoriesSection.style.display = 'grid';
        categoriesSection.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        categoriesSection.style.gap = '30px';
        categoriesSection.style.justifyContent = 'center';

        categoriesSection.innerHTML = catHTML;
    }

    // Populate Best Sellers (Top 4 rated)
    const bestSellersGrid = document.getElementById('best-sellers-grid');
    if (bestSellersGrid) {
        const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
        bestSellersGrid.className = 'modern-shop-grid';
        bestSellersGrid.innerHTML = topProducts.map(p => createModernProductCard(p)).join('');
        if (typeof initHeartIcons === 'function') initHeartIcons();
    }

    // Populate Testimonials
    const testGrid = document.getElementById('testimonials-container');
    if (testGrid) {
        testGrid.className = 'grid-3';
        const reviews = [
            { text: "The roses I ordered for my anniversary were absolutely stunning! Fresh, vibrant, and delivered right on time.", author: "Florist." },
            { text: "Friends Florist is my go-to for all events. Their attention to detail in the arrangements is unmatched.", author: "Sameer." },
            { text: "Beautiful packaging and the flowers lasted much longer than expected. Highly recommended!", author: "Shaik Naseer." }
        ];
        testGrid.innerHTML = reviews.map(r => `
            <div style="background: white; padding: 30px; border-radius: var(--border-radius); box-shadow: 0 5px 15px rgba(0,0,0,0.05); text-align: center;">
                <div style="color: #f39c12; font-size: 1.5rem; margin-bottom: 15px;">★★★★★</div>
                <p style="font-style: italic; margin-bottom: 20px;">"${r.text}"</p>
                <h4 style="color: var(--color-dark-green);">- ${r.author}</h4>
            </div>
        `).join('');
    }

    // Initialize Hero Slideshow
    initHeroSlideshow();
}

function initHeroSlideshow() {
    const slideshow = document.getElementById('hero-slideshow');
    if (!slideshow || !products || products.length === 0) return;

    // Clear existing content and populate with all product images
    slideshow.innerHTML = products.map((product, index) => `
        <img src="${product.image || fallbackImage}" 
             alt="${product.name}" 
             class="${index === 0 ? 'active' : ''}">
    `).join('');

    const images = slideshow.querySelectorAll('img');
    let currentIndex = 0;

    // Function to show next image
    const nextImage = () => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    };

    // Change image every 2 seconds (2000ms) for a snappier feel
    setInterval(nextImage, 2000);
}

// Stub for Quick View Modal
window.quickView = function(id) {
    const product = products.find(p => p.id === id);
    if(product) {
        openModal({
            title: 'Quick View',
            message: `${product.name}<br>₹${product.price.toLocaleString('en-IN')}<br><br>${product.description}`,
            type: 'info'
        });
    }
}

// Global Notification System

// Create and append toast container if not exists
function getToastContainer() {
    let container = document.getElementById('custom-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'custom-toast-container';
        container.className = 'custom-toast-container';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Show a custom toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', 'info'
 * @param {string} title - Optional title
 */
window.showToast = function(message, type = 'success', title = '') {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    
    let icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'info') icon = 'ℹ️';

    let titleHtml = title ? `<div class="custom-toast-title">${title}</div>` : '';
    let defaultTitle = type === 'success' ? 'Success' : (type === 'error' ? 'Error' : 'Notification');
    if (!title && type !== 'info') {
        titleHtml = `<div class="custom-toast-title">${defaultTitle}</div>`;
    }

    toast.innerHTML = `
        <div class="custom-toast-icon">${icon}</div>
        <div class="custom-toast-content">
            ${titleHtml}
            <div class="custom-toast-message">${message}</div>
        </div>
        <div class="custom-toast-close" onclick="this.parentElement.remove()">&times;</div>
    `;

    container.appendChild(toast);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 300);
        }
    }, 3000);
};

// Create and append modal container if not exists
function getModalContainer() {
    let container = document.getElementById('custom-modal-overlay');
    if (!container) {
        container = document.createElement('div');
        container.id = 'custom-modal-overlay';
        container.className = 'custom-modal-overlay';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Show a custom modal dialog
 * @param {Object} options - { title, message, type, onConfirm, onCancel, confirmText, cancelText }
 */
window.openModal = function({ title, message, type = 'info', onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' }) {
    const container = getModalContainer();
    
    let icon = '';
    if (type === 'success') icon = '✅ ';
    if (type === 'error') icon = '❌ ';

    let footerHtml = '';
    if (onConfirm || onCancel) {
        if (onCancel) {
            footerHtml += `<button class="btn btn-secondary" id="custom-modal-btn-cancel">${cancelText}</button>`;
        }
        footerHtml += `<button class="btn btn-primary" id="custom-modal-btn-confirm">${confirmText}</button>`;
    } else {
        footerHtml += `<button class="btn btn-primary" id="custom-modal-btn-ok">Close</button>`;
    }

    container.innerHTML = `
        <div class="custom-modal">
            <div class="custom-modal-header">
                <h3 class="custom-modal-title">${icon}${title || 'Notification'}</h3>
                <div class="custom-modal-close" id="custom-modal-btn-close">&times;</div>
            </div>
            <div class="custom-modal-body">
                ${message}
            </div>
            <div class="custom-modal-footer">
                ${footerHtml}
            </div>
        </div>
    `;

    // Add event listeners
    const closeModal = () => {
        container.classList.remove('active');
        setTimeout(() => container.remove(), 300);
    };

    const closeBtn = document.getElementById('custom-modal-btn-close');
    if (closeBtn) closeBtn.onclick = () => {
        if (onCancel) onCancel();
        closeModal();
    };

    const okBtn = document.getElementById('custom-modal-btn-ok');
    if (okBtn) okBtn.onclick = closeModal;

    const cancelBtn = document.getElementById('custom-modal-btn-cancel');
    if (cancelBtn) cancelBtn.onclick = () => {
        if (onCancel) onCancel();
        closeModal();
    };

    const confirmBtn = document.getElementById('custom-modal-btn-confirm');
    if (confirmBtn) confirmBtn.onclick = () => {
        if (onConfirm) onConfirm();
        closeModal();
    };

    // Close on overlay click
    container.onclick = (e) => {
        if (e.target === container) {
            if (onCancel) onCancel();
            closeModal();
        }
    };

    // Show modal
    // small delay to ensure DOM update before adding class for transition
    setTimeout(() => {
        container.classList.add('active');
    }, 10);
};

// Global confirm override
window.customConfirm = function(message, onConfirm, onCancel) {
    openModal({
        title: 'Please Confirm',
        message: message,
        type: 'info',
        onConfirm: onConfirm,
        onCancel: onCancel || function() {},
        confirmText: 'Yes',
        cancelText: 'No'
    });
};

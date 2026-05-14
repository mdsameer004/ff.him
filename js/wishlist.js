// Wishlist System
// Uses localStorage key: 'friendsFloristWishlist'

function loadWishlist() {
    return JSON.parse(localStorage.getItem('friendsFloristWishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('friendsFloristWishlist', JSON.stringify(wishlist));
}

function isWishlisted(productId) {
    return loadWishlist().includes(productId);
}

function toggleWishlist(productId, event) {
    if (event) event.stopPropagation();

    let wishlist = loadWishlist();
    const index = wishlist.indexOf(productId);
    let added = false;

    if (index === -1) {
        wishlist.push(productId);
        added = true;
    } else {
        wishlist.splice(index, 1);
    }

    saveWishlist(wishlist);
    updateAllHeartIcons(productId, added);
    updateWishlistBadge();

    const product = products.find(p => p.id === productId);
    const name = product ? product.name : 'Product';
    if (added) {
        showToast(`${name} added to wishlist ❤️`, 'success', 'Wishlist');
    } else {
        showToast(`${name} removed from wishlist`, 'info', 'Wishlist');
    }
}

// Update all heart icons on the page for a given product
function updateAllHeartIcons(productId, filled) {
    document.querySelectorAll(`.wishlist-heart[data-id="${productId}"]`).forEach(btn => {
        const heartSvg = btn.querySelector('.heart-svg');
        if (heartSvg) {
            heartSvg.innerHTML = filled ? getFilledHeart() : getOutlineHeart();
            btn.classList.toggle('wishlisted', filled);
        }
    });
}

function getOutlineHeart() {
    return `<path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>`;
}

function getFilledHeart() {
    return `<path fill="currentColor" d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>`;
}

// Build a heart button HTML string (used inside product card HTML template)
function heartButtonHTML(productId) {
    const filled = isWishlisted(productId);
    return `
        <button class="wishlist-heart ${filled ? 'wishlisted' : ''}" 
                data-id="${productId}" 
                onclick="toggleWishlist(${productId}, event)" 
                title="${filled ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                aria-label="Wishlist toggle">
            <svg class="heart-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                ${filled ? getFilledHeart() : getOutlineHeart()}
            </svg>
        </button>
    `;
}

// Update wishlist badge in navbar
function updateWishlistBadge() {
    const badge = document.querySelector('.wishlist-badge');
    if (badge) {
        const count = loadWishlist().length;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Render the wishlist page (wishlist.html)
function renderWishlistPage() {
    const container = document.getElementById('wishlist-grid');
    if (!container) return;

    const wishlist = loadWishlist();

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <div class="empty-icon">🤍</div>
                <h2>Your wishlist is empty</h2>
                <p>Save items you love by clicking the ❤️ heart on any product.</p>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Browse Products</a>
            </div>
        `;
        return;
    }

    const wishlisted = products.filter(p => wishlist.includes(p.id));
    container.className = 'modern-shop-grid';
    container.innerHTML = wishlisted.map(p => createModernProductCard(p)).join('');

    // Re-init heart icons now that cards are rendered
    initHeartIcons();
}

// Init all heart buttons on current page after DOM is ready
function initHeartIcons() {
    document.querySelectorAll('.wishlist-heart').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        const filled = isWishlisted(id);
        const heartSvg = btn.querySelector('.heart-svg');
        if (heartSvg) {
            heartSvg.innerHTML = filled ? getFilledHeart() : getOutlineHeart();
            btn.classList.toggle('wishlisted', filled);
        }
    });
    updateWishlistBadge();
}

// Auto-init on page load
document.addEventListener('DOMContentLoaded', () => {
    initHeartIcons();
    updateWishlistBadge();
});

window.toggleWishlist = toggleWishlist;
window.loadWishlist = loadWishlist;
window.renderWishlistPage = renderWishlistPage;
window.heartButtonHTML = heartButtonHTML;
window.initHeartIcons = initHeartIcons;

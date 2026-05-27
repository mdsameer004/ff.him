// admin-common.js

// Inject Custom Stylesheets & Brand Overrides immediately on parse
(function() {
    // 1. Inject Google Fonts
    if (!document.querySelector('link[href*="Playfair+Display"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap';
        document.head.appendChild(fontLink);
    }

    // 2. Inject Style Tag
    const styleEl = document.createElement('style');
    styleEl.id = 'admin-brand-overrides';
    styleEl.innerHTML = `
        /* Global Font & Body Overrides */
        body {
            font-family: 'Poppins', sans-serif !important;
            background-color: #FFFDF9 !important;
            min-height: 100vh;
            position: relative;
            z-index: 0;
        }
        
        /* Repeating floral background overlay */
        body::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("../images/floral-bg.png") !important;
            background-repeat: repeat !important;
            background-size: 500px auto !important;
            opacity: 0.94;
            z-index: -1;
            pointer-events: none;
        }

        h1, h2, h3, h4, h5, h6, .font-serif {
            font-family: 'Playfair Display', serif !important;
            color: #1e3f2d !important;
            font-weight: 600 !important;
        }

        /* Forms, inputs, select fields */
        input, select, textarea {
            border: 1px solid #F5E6C8 !important;
            background-color: rgba(255, 255, 255, 0.85) !important;
            transition: all 0.3s ease !important;
            border-radius: 0.75rem !important;
        }
        input:focus, select:focus, textarea:focus {
            border-color: #1e3f2d !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(30, 63, 45, 0.15) !important;
            background-color: #ffffff !important;
        }

        /* Buttons & Badges standardisation */
        .bg-rose-500 {
            background-color: #1e3f2d !important;
            color: #ffffff !important;
        }
        .hover\\:bg-rose-600:hover {
            background-color: #2E8B57 !important;
        }
        .text-rose-600 {
            color: #1e3f2d !important;
        }
        .text-rose-500 {
            color: #2E8B57 !important;
        }
        .border-rose-100 {
            border-color: #F5E6C8 !important;
        }
        .border-rose-200 {
            border-color: #D4A5A5 !important;
        }
        .bg-rose-50 {
            background-color: #FFF0F5 !important;
            color: #1e3f2d !important;
        }
        .hover\\:bg-rose-100:hover {
            background-color: #FADADD !important;
        }

        /* Cards styling rules */
        .bg-white, .bg-white\\/80 {
            background-color: rgba(255, 253, 249, 0.9) !important;
            border: 1px solid #F5E6C8 !important;
            box-shadow: 0 10px 25px -5px rgba(245, 230, 200, 0.25), 0 8px 10px -6px rgba(245, 230, 200, 0.2) !important;
            position: relative;
            z-index: 1;
            border-radius: 1.25rem !important;
        }
        .bg-white::before, .bg-white\\/80::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("../images/floral-bg-pink.png") !important;
            background-repeat: repeat;
            background-size: 350px auto;
            opacity: 0.12;
            z-index: -1;
            pointer-events: none;
            border-radius: inherit;
        }

        /* Tables & Lists overrides */
        table {
            background-color: transparent !important;
        }
        tr {
            background-color: transparent !important;
            transition: background-color 0.25s ease !important;
        }
        tr:hover {
            background-color: rgba(250, 218, 221, 0.15) !important;
        }
        th {
            font-family: 'Poppins', sans-serif !important;
            color: #1e3f2d !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #F5E6C8 !important;
        }

        /* Custom Scrollbar for Luxury Aesthetics */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #FFFDF9;
        }
        ::-webkit-scrollbar-thumb {
            background: #B2C9AD;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #1e3f2d;
        }

        /* Sidebar Styling overrides */
        #admin-sidebar {
            background-color: #1e3f2d !important;
            border-right: 2px solid #F5E6C8 !important;
        }
        #admin-sidebar .nav-item {
            color: #E8F5E9 !important;
            font-family: 'Poppins', sans-serif !important;
        }
        #admin-sidebar .nav-item:hover {
            background-color: rgba(178, 201, 173, 0.15) !important;
            color: #ffffff !important;
        }
        #admin-sidebar .nav-item.bg-rose-500 {
            background-color: #FADADD !important;
            color: #1e3f2d !important;
            font-weight: 700 !important;
            border-left: 4px solid #D4AF37 !important;
            box-shadow: 0 4px 12px rgba(250, 218, 221, 0.25) !important;
        }
        #admin-sidebar .nav-item.bg-rose-500 span {
            color: #1e3f2d !important;
        }
        #admin-sidebar button {
            background-color: rgba(250, 218, 221, 0.08) !important;
            border: 1px solid rgba(250, 218, 221, 0.18) !important;
            color: #FADADD !important;
        }
        #admin-sidebar button:hover {
            background-color: rgba(250, 218, 221, 0.22) !important;
            color: #ffffff !important;
        }

        /* Header overrides */
        header {
            background-color: rgba(255, 253, 249, 0.88) !important;
            backdrop-filter: blur(12px) !important;
            border-bottom: 1.5px solid rgba(245, 230, 200, 0.8) !important;
        }

        /* Dark Mode High-contrast Overrides */
        html.dark body {
            background-color: #0f172a !important;
            color: #f1f5f9 !important;
        }
        html.dark body::before {
            display: none !important;
        }
        html.dark h1, html.dark h2, html.dark h3, html.dark h4, html.dark h5, html.dark h6 {
            color: #f8fafc !important;
        }
        html.dark .bg-white, html.dark .bg-white\\/80 {
            background-color: #1e293b !important;
            border-color: #334155 !important;
            box-shadow: none !important;
        }
        html.dark .bg-white::before, html.dark .bg-white\\/80::before {
            display: none !important;
        }
        html.dark input, html.dark select, html.dark textarea {
            background-color: #1e293b !important;
            border-color: #475569 !important;
            color: #f8fafc !important;
        }
        html.dark input:focus, html.dark select:focus, html.dark textarea:focus {
            border-color: #38bdf8 !important;
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2) !important;
        }
        html.dark #admin-sidebar {
            background-color: #1e293b !important;
            border-right: 1px solid #334155 !important;
        }
        html.dark #admin-sidebar .nav-item.bg-rose-500 {
            background-color: #334155 !important;
            color: #38bdf8 !important;
            border-left: 4px solid #38bdf8 !important;
        }
        html.dark #admin-sidebar .nav-item.bg-rose-500 span {
            color: #38bdf8 !important;
        }
        html.dark th {
            color: #cbd5e1 !important;
            border-bottom: 2px solid #334155 !important;
        }
        html.dark tr:hover {
            background-color: rgba(51, 65, 85, 0.3) !important;
        }
    `;
    document.head.appendChild(styleEl);
})();

// 1. Authentication Guard
const isAuthenticated = !!localStorage.getItem('ff_jwt_token') || 
                        localStorage.getItem('ff_admin_auth') === 'true' ||
                        !!sessionStorage.getItem('ff_jwt_token') || 
                        sessionStorage.getItem('ff_admin_auth') === 'true';
const isLoginPage = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname.endsWith('/admin') || 
                    window.location.pathname.endsWith('/admin/') ||
                    window.location.pathname.includes('admin/index.html');

if (!isAuthenticated && !isLoginPage) {
    window.location.href = 'index.html';
}

// 2. LocalStorage Helpers
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
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&h=800&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&h=800&auto=format&fit=crop",
        description: "Stunning pure white elegant wedding bouquet, designed to accompany you on your most beautiful day."
    }
];

async function getProducts() {
    if (window.apiClient) {
        try {
            return await window.apiClient.getProducts();
        } catch (e) {
            console.error("Failed to load products from API client:", e);
        }
    }
    try {
        const stored = localStorage.getItem('products');
        if (!stored) {
            localStorage.setItem('products', JSON.stringify(defaultProducts));
            return defaultProducts;
        }
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
            const p1 = parsed.find(p => p.id === 1);
            if (p1 && p1.name !== "rose lily bouquet") {
                localStorage.setItem('products', JSON.stringify(defaultProducts));
                return defaultProducts;
            }
            return parsed;
        }
        return defaultProducts;
    } catch (e) {
        console.error(e);
        return defaultProducts;
    }
}

async function saveProducts(products) {
    if (window.apiClient && !window.API_FALLBACK) {
        // Under full backend mode, direct CRUD is used, so bulk saving isn't needed or is a no-op
        return true;
    }
    try {
        localStorage.setItem('products', JSON.stringify(products));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function getDeals() {
    if (window.apiClient) {
        try {
            return await window.apiClient.getDeals();
        } catch (e) {
            console.error(e);
        }
    }
    try {
        return JSON.parse(localStorage.getItem('flash_deals')) || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function saveDeals(deals) {
    if (window.apiClient) {
        try {
            await window.apiClient.saveDeals(deals);
            return true;
        } catch (e) {
            console.error(e);
        }
    }
    try {
        localStorage.setItem('flash_deals', JSON.stringify(deals));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function getAlbums() {
    if (window.apiClient) {
        try {
            return await window.apiClient.getAlbums();
        } catch (e) {
            console.error(e);
        }
    }
    try {
        return JSON.parse(localStorage.getItem('albumsData')) || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function saveAlbums(albums) {
    if (window.apiClient) {
        try {
            await window.apiClient.saveAlbums(albums);
            return true;
        } catch (e) {
            console.error(e);
        }
    }
    try {
        localStorage.setItem('albumsData', JSON.stringify(albums));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

// 3. Dynamic Sidebar Layout Injector
document.addEventListener('DOMContentLoaded', () => {
    // Only inject sidebar/layout on dashboard/details pages, not on index.html (login page)
    if (isLoginPage) return;

    // Load Dark Mode State
    const isDarkMode = localStorage.getItem('ff_admin_dark_mode') === 'true';
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('bg-gray-900', 'text-gray-100');
        document.body.classList.remove('bg-rose-50/30', 'text-gray-800');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-gray-900', 'text-gray-100');
        document.body.classList.add('bg-rose-50/30', 'text-gray-800');
    }

    const currentFile = window.location.pathname.split('/').pop() || 'dashboard.html';

    // Capture original main content
    const originalContent = document.getElementById('admin-content') ? document.getElementById('admin-content').innerHTML : '';
    const pageTitle = document.title || 'Admin Panel';

    // Render unified premium dashboard structure
    document.body.innerHTML = `
    <div class="min-h-screen flex flex-col md:flex-row">
        <!-- Sidebar -->
        <aside id="admin-sidebar" class="w-full md:w-64 md:min-h-screen shadow-md flex flex-col transition-all duration-300 md:block hidden">
            <!-- Sidebar Brand Header -->
            <div class="p-6 border-b border-[#F5E6C8]/20 flex items-center justify-between">
                <a href="../index.html" class="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity" style="font-family: 'Playfair Display', serif !important;">
                    <span class="text-rose-100">🌹 Friends</span> <span class="text-emerald-200 font-normal">Florist</span>
                </a>
                <button onclick="toggleMobileSidebar()" class="md:hidden text-gray-400 hover:text-gray-200">✕</button>
            </div>
            
            <!-- Navigation Links -->
            <nav class="flex-1 px-4 py-6 space-y-2">
                <a href="dashboard.html" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${currentFile === 'dashboard.html' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600'}">
                    📊 <span>Dashboard</span>
                </a>
                <a href="products.html" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${currentFile === 'products.html' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600'}">
                    🌹 <span>Products</span>
                </a>
                <a href="flash-deals.html" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${currentFile === 'flash-deals.html' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600'}">
                    ⚡ <span>Flash Deals</span>
                </a>
                <a href="gallery.html" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${currentFile === 'gallery.html' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600'}">
                    🖼️ <span>Gallery Albums</span>
                </a>
                <a href="settings.html" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${currentFile === 'settings.html' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600'}">
                    ⚙️ <span>Settings</span>
                </a>
            </nav>
            
            <!-- Sidebar Footer Log Out -->
            <div class="p-4 border-t border-[#F5E6C8]/20">
                <button onclick="handleLogout()" class="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-sm rounded-xl transition-all">
                    🚪 <span>Log Out</span>
                </button>
            </div>
        </aside>

        <!-- Main Workspace -->
        <div class="flex-1 flex flex-col min-w-0">
            <!-- Top Navigation bar -->
            <header class="h-16 px-6 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-3">
                    <button onclick="toggleMobileSidebar()" class="md:hidden text-2xl text-emerald-800 hover:text-emerald-900 dark:text-white focus:outline-none">☰</button>
                    <h1 class="text-xl font-bold capitalize" style="font-family: 'Playfair Display', serif !important;">${pageTitle}</h1>
                </div>
                <div class="flex items-center gap-4">
                    <!-- Theme Toggle -->
                    <button onclick="toggleTheme()" class="p-2 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 focus:outline-none text-xl" title="Toggle Theme">
                        ${isDarkMode ? '☀️' : '🌙'}
                    </button>
                    <!-- Admin Avatar -->
                    <div class="flex items-center gap-2 border-l border-[#F5E6C8]/60 pl-4">
                        <div class="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center font-bold text-emerald-800 shadow-inner">
                            A
                        </div>
                        <span class="text-xs font-semibold text-emerald-800 dark:text-gray-400 hidden sm:inline">Admin</span>
                    </div>
                </div>
            </header>

            <!-- Page Workspace Content -->
            <main class="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
                ${originalContent}
            </main>
        </div>
    </div>
    `;

    // Intercept clicks on links that go out of the admin panel back to the store (e.g. brand logo link)
    const brandLinks = document.querySelectorAll('a[href="../index.html"]');
    brandLinks.forEach(link => {
        link.addEventListener('click', () => {
            localStorage.removeItem('ff_jwt_token');
            localStorage.removeItem('ff_admin_auth');
            sessionStorage.removeItem('ff_jwt_token');
            sessionStorage.removeItem('ff_admin_auth');
            if (window.apiClient) {
                window.apiClient.logout();
            }
            console.info('[Friends Florist Auth] Session cleared on exit to main store.');
        });
    });
});

// Mobile Sidebar toggle handler
function toggleMobileSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('fixed');
        sidebar.classList.toggle('z-50');
        sidebar.classList.toggle('inset-y-0');
        sidebar.classList.toggle('left-0');
        sidebar.classList.toggle('w-72');
    }
}

// Log out handler
function handleLogout() {
    if (confirm("Are you sure you want to log out of the admin panel?")) {
        localStorage.removeItem('ff_jwt_token');
        localStorage.removeItem('ff_admin_auth');
        sessionStorage.removeItem('ff_jwt_token');
        sessionStorage.removeItem('ff_admin_auth');
        if (window.apiClient) {
            window.apiClient.logout();
        }
        window.location.href = 'index.html';
    }
}

// Dynamic Theme Toggle
function toggleTheme() {
    const isDarkMode = localStorage.getItem('ff_admin_dark_mode') === 'true';
    localStorage.setItem('ff_admin_dark_mode', (!isDarkMode).toString());
    window.location.reload();
}

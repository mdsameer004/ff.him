// admin-common.js

// 1. Authentication Guard
const isAuthenticated = localStorage.getItem('ff_admin_auth') === 'true';
const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/admin/');

if (!isAuthenticated && !isLoginPage) {
    window.location.href = 'index.html';
}

// 2. LocalStorage Helpers
const defaultProducts = [
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

function getProducts() {
    try {
        const stored = localStorage.getItem('products');
        if (!stored) {
            localStorage.setItem('products', JSON.stringify(defaultProducts));
            return defaultProducts;
        }
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProducts;
    } catch (e) {
        console.error(e);
        return defaultProducts;
    }
}

function saveProducts(products) {
    try {
        localStorage.setItem('products', JSON.stringify(products));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

function getDeals() {
    try {
        return JSON.parse(localStorage.getItem('flash_deals')) || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

function saveDeals(deals) {
    try {
        localStorage.setItem('flash_deals', JSON.stringify(deals));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

function getAlbums() {
    try {
        return JSON.parse(localStorage.getItem('albumsData')) || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

function saveAlbums(albums) {
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
    <div class="min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-rose-50/30 text-gray-800'}">
        <!-- Sidebar -->
        <aside id="admin-sidebar" class="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-rose-100/50 dark:border-gray-700 md:min-h-screen shadow-md flex flex-col transition-all duration-300 md:block hidden">
            <!-- Sidebar Brand Header -->
            <div class="p-6 border-b border-rose-50 dark:border-gray-700 flex items-center justify-between">
                <a href="../index.html" class="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400 text-lg hover:opacity-80 transition-opacity">
                    🌹 Friends <span class="text-emerald-800 dark:text-emerald-400 font-normal">Florist</span>
                </a>
                <button onclick="toggleMobileSidebar()" class="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
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
            <div class="p-4 border-t border-rose-50 dark:border-gray-700">
                <button onclick="handleLogout()" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 dark:bg-gray-750 dark:hover:bg-gray-700 text-rose-600 font-semibold text-sm rounded-xl transition-all">
                    🚪 <span>Log Out</span>
                </button>
            </div>
        </aside>

        <!-- Main Workspace -->
        <div class="flex-1 flex flex-col min-w-0">
            <!-- Top Navigation bar -->
            <header class="bg-white dark:bg-gray-800 border-b border-rose-100/50 dark:border-gray-700 h-16 px-6 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-3">
                    <button onclick="toggleMobileSidebar()" class="md:hidden text-2xl text-rose-600 hover:text-rose-700 focus:outline-none">☰</button>
                    <h1 class="text-lg font-bold text-gray-800 dark:text-white capitalize">${pageTitle}</h1>
                </div>
                <div class="flex items-center gap-4">
                    <!-- Theme Toggle -->
                    <button onclick="toggleTheme()" class="p-2 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 focus:outline-none text-xl" title="Toggle Theme">
                        ${isDarkMode ? '☀️' : '🌙'}
                    </button>
                    <!-- Admin Avatar -->
                    <div class="flex items-center gap-2 border-l border-rose-100 dark:border-gray-700 pl-4">
                        <div class="w-8 h-8 rounded-full bg-rose-200 dark:bg-gray-700 flex items-center justify-center font-bold text-rose-700 dark:text-rose-400 shadow-inner">
                            A
                        </div>
                        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline">Admin</span>
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
        localStorage.removeItem('ff_admin_auth');
        window.location.href = 'index.html';
    }
}

// Dynamic Theme Toggle
function toggleTheme() {
    const isDarkMode = localStorage.getItem('ff_admin_dark_mode') === 'true';
    localStorage.setItem('ff_admin_dark_mode', (!isDarkMode).toString());
    window.location.reload();
}

// js/api-client.js  v2.0.0
// Modern, Unified REST API Client for Friends Florist
// Connected to deployed backend: https://floristbackend.onrender.com

window.API_BASE_URL = 'https://floristbackend.onrender.com/api';
window.API_FALLBACK = false; // Live backend active — only falls back on network failure


class ApiClient {
    constructor() {
        this.fallbackDelay = 300; // Simulated latency for fallback requests
    }

    // JWT Token Management helpers
    getToken() {
        return localStorage.getItem('ff_jwt_token');
    }

    setToken(token) {
        if (token) {
            localStorage.setItem('ff_jwt_token', token);
            localStorage.setItem('ff_admin_auth', 'true'); // Backward compatibility for legacy files
        } else {
            localStorage.removeItem('ff_jwt_token');
            localStorage.removeItem('ff_admin_auth');
        }
    }

    getHeaders(secured = false) {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (secured) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }

    // Primary request runner with automatic fallback detection
    async request(path, options = {}, secured = false) {
        // If API_FALLBACK is active, skip the network entirely and go straight to local DB
        if (window.API_FALLBACK) {
            const clonedOptions = { ...options, headers: { ...this.getHeaders(secured), ...(options.headers || {}) } };
            console.info(`%c[Friends Florist Local DB] API_FALLBACK active. Serving ${options.method || 'GET'} ${path} from local database.`, 'color: #2E8B57; font-weight: bold;');
            return this.executeFallback(path, clonedOptions);
        }

        const url = `${window.API_BASE_URL}${path}`;
        options.headers = { ...this.getHeaders(secured), ...options.headers };

        try {
            // Attempt live backend API call
            const response = await fetch(url, options);

            if (response.status === 401 || response.status === 403) {
                console.warn('Authentication token invalid or expired. Logging out.');
                this.setToken(null);
            }

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || `HTTP Request Failed: status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            // Network-level failure (e.g. server offline) — activate local fallback
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.info(`%c[Friends Florist Local DB] Network error on ${path}: "${error.message}". Activating local database fallback.`, 'color: #2E8B57; font-weight: bold;');
                return this.executeFallback(path, options);
            }
            throw error;
        }
    }

    // Dynamic Client-side Simulated Local Database (LocalStorage Fallback)
    executeFallback(path, options) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const method = (options.method || 'GET').toUpperCase();
                    const body = options.body ? JSON.parse(options.body) : null;

                    // 1. AUTH LOGIN FALLBACK
                    if (path.startsWith('/auth/login') && method === 'POST') {
                        const { email, password } = body;
                        const normalizedEmail = (email || '').trim().toLowerCase();
                        if (normalizedEmail === 'admin@friendsflorist.com' && password === 'Friends@123') {
                            const mockToken = 'mock-jwt-header-token-for-admin-friends-florist';
                            this.setToken(mockToken);
                            resolve({
                                success: true,
                                token: mockToken,
                                user: { email: 'admin@friendsflorist.com', role: 'admin', name: 'Admin User' }
                            });
                        } else if ((normalizedEmail === 'editor@admin.com' || normalizedEmail === 'editor') && password === 'editor') {
                            const mockToken = 'mock-jwt-header-token-for-editor';
                            this.setToken(mockToken);
                            resolve({
                                success: true,
                                token: mockToken,
                                user: { email: 'editor@admin.com', role: 'editor', name: 'Editor User' }
                            });
                        } else {
                            reject(new Error('Invalid email address or password.'));
                        }
                        return;
                    }

                    // 2. PRODUCTS FALLBACK
                    if (path.startsWith('/products')) {
                        const storedProducts = localStorage.getItem('products');
                        let products = storedProducts ? JSON.parse(storedProducts) : [];
                        
                        // Parse id from /products/:id
                        const pathParts = path.split('/');
                        const idParam = pathParts.length > 2 ? parseInt(pathParts[2]) : null;

                        if (idParam) {
                            const index = products.findIndex(p => p.id === idParam);
                            if (method === 'GET') {
                                if (index !== -1) resolve(products[index]);
                                else reject(new Error('Product not found'));
                            } else if (method === 'PUT') {
                                if (index !== -1) {
                                    products[index] = { ...products[index], ...body };
                                    localStorage.setItem('products', JSON.stringify(products));
                                    resolve(products[index]);
                                } else {
                                    reject(new Error('Product not found'));
                                }
                            } else if (method === 'DELETE') {
                                if (index !== -1) {
                                    const deleted = products.splice(index, 1);
                                    localStorage.setItem('products', JSON.stringify(products));
                                    resolve({ success: true, deleted: deleted[0] });
                                } else {
                                    reject(new Error('Product not found'));
                                }
                            }
                        } else {
                            if (method === 'GET') {
                                resolve(products);
                            } else if (method === 'POST') {
                                const newProduct = {
                                    id: Date.now(),
                                    ...body
                                };
                                products.push(newProduct);
                                localStorage.setItem('products', JSON.stringify(products));
                                resolve(newProduct);
                            }
                        }
                        return;
                    }

                    // 3. FLASH DEALS FALLBACK
                    if (path.startsWith('/deals')) {
                        if (method === 'GET') {
                            const deals = JSON.parse(localStorage.getItem('flash_deals')) || [];
                            resolve(deals);
                        } else if (method === 'POST' || method === 'PUT') {
                            localStorage.setItem('flash_deals', JSON.stringify(body));
                            resolve({ success: true, deals: body });
                        }
                        return;
                    }

                    // 4. ALBUMS GALLERY FALLBACK
                    if (path.startsWith('/albums')) {
                        if (method === 'GET') {
                            const stored = localStorage.getItem('albumsData');
                            let albums = stored ? JSON.parse(stored) : [];
                            if (!Array.isArray(albums) || albums.length === 0) {
                                albums = window.albumsData || [];
                            }
                            resolve(albums);
                        } else if (method === 'POST' || method === 'PUT') {
                            localStorage.setItem('albumsData', JSON.stringify(body));
                            resolve({ success: true, albums: body });
                        }
                        return;
                    }

                    // 5. ORDERS FALLBACK
                    if (path.startsWith('/orders')) {
                        const storedOrders = localStorage.getItem('friendsFloristOrders');
                        let orders = storedOrders ? JSON.parse(storedOrders) : [
                            { id: "ORD-9901", customer: "John Doe", items: [{ name: "Classic Red Rose Bouquet", price: 499, quantity: 1, image: "https://images.unsplash.com/photo-1767824122857-9a1521db58d3?q=80&w=800&h=800&auto=format&fit=crop" }], total: 499, status: "Pending", date: "2026-05-23", deliveryDetails: { name: "John Doe", email: "john@example.com", phone: "9876543210" } },
                            { id: "ORD-9902", customer: "Sarah Smith", items: [{ name: "Romantic Love Bouquet", price: 549, quantity: 2, image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&h=800&auto=format&fit=crop" }], total: 1098, status: "Delivered", date: "2026-05-22", deliveryDetails: { name: "Sarah Smith", email: "sarah@example.com", phone: "9876543210" } },
                            { id: "ORD-9903", customer: "Jane Doe", items: [{ name: "Birthday Celebration Bouquet", price: 649, quantity: 1, image: "https://images.unsplash.com/photo-1667489024245-7beb09ac43c5?q=80&w=800&h=800&auto=format&fit=crop" }], total: 649, status: "Processing", date: "2026-05-20", deliveryDetails: { name: "Jane Doe", email: "jane@example.com", phone: "9876543210" } },
                            { id: "ORD-9904", customer: "Michael Brown", items: [{ name: "Anniversary Special Bouquet", price: 849, quantity: 1, image: "https://images.unsplash.com/photo-1729151634645-1f4ed2938f0b?q=80&w=800&h=800&auto=format&fit=crop" }], total: 849, status: "Delivered", date: "2026-05-15", deliveryDetails: { name: "Michael Brown", email: "michael@example.com", phone: "9876543210" } },
                            { id: "ORD-9905", customer: "David Wilson", items: [{ name: "Spring Garden Bouquet", price: 749, quantity: 2, image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&h=800&auto=format&fit=crop" }], total: 1498, status: "Delivered", date: "2026-04-10", deliveryDetails: { name: "David Wilson", email: "david@example.com", phone: "9876543210" } },
                            { id: "ORD-9906", customer: "Emily Davis", items: [{ name: "Elegant Mixed Flower Bouquet", price: 599, quantity: 3, image: "https://images.unsplash.com/photo-1699830008232-fe4ae2a6ee11?q=80&w=800&h=800&auto=format&fit=crop" }], total: 1797, status: "Delivered", date: "2026-01-05", deliveryDetails: { name: "Emily Davis", email: "emily@example.com", phone: "9876543210" } },
                            { id: "ORD-9907", customer: "Robert Taylor", items: [{ name: "Premium Rose Basket", price: 949, quantity: 1, image: "https://plus.unsplash.com/premium_photo-1674197235302-1190e266fd04?q=80&w=800&h=800&auto=format&fit=crop" }], total: 949, status: "Delivered", date: "2025-11-20", deliveryDetails: { name: "Robert Taylor", email: "robert@example.com", phone: "9876543210" } }
                        ];

                        // Seed localStorage if empty
                        if (!storedOrders) {
                            localStorage.setItem('friendsFloristOrders', JSON.stringify(orders));
                        }

                        const pathParts = path.split('/');
                        // Remove empty string from split
                        const cleanParts = pathParts.filter(Boolean);
                        const idParam = cleanParts.length > 1 ? cleanParts[1] : null;

                        if (idParam) {
                            const index = orders.findIndex(o => o.id === idParam || o.id === '#' + idParam || '#' + o.id === idParam);
                            if (method === 'GET') {
                                if (index !== -1) resolve(orders[index]);
                                else reject(new Error('Order not found'));
                            } else if (method === 'PUT') {
                                if (index !== -1) {
                                    orders[index] = { ...orders[index], ...body };
                                    localStorage.setItem('friendsFloristOrders', JSON.stringify(orders));
                                    resolve(orders[index]);
                                } else {
                                    reject(new Error('Order not found'));
                                }
                            }
                        } else {
                            if (method === 'GET') {
                                resolve(orders);
                            } else if (method === 'POST') {
                                const newOrder = {
                                    id: 'FF-' + Math.floor(1000 + Math.random() * 9000),
                                    date: new Date().toISOString().split('T')[0],
                                    status: 'Pending',
                                    ...body
                                };
                                orders.push(newOrder);
                                localStorage.setItem('friendsFloristOrders', JSON.stringify(orders));
                                resolve(newOrder);
                            }
                        }
                        return;
                    }

                    // Unknown fallback endpoint
                    reject(new Error(`Simulated DB Endpoint Not Found: ${method} ${path}`));
                } catch (e) {
                    reject(e);
                }
            }, this.fallbackDelay);
        });
    }

    // Dynamic Helper API endpoints exposed to frontend scripts
    async login(email, password) {
        // Attempt live backend login first, fall back to local credentials on network failure
        const normalizedEmail = (email || '').trim().toLowerCase();
        const normalizedPassword = (password || '').trim();
        try {
            const response = await fetch(`${window.API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword })
            });
            if (!response.ok) {
                const errBody = await response.json().catch(() => ({}));
                throw new Error(errBody.message || `Login failed: ${response.status}`);
            }
            const data = await response.json();
            this.setToken(data.token);
            return data;
        } catch (error) {
            // Fall back to local credentials only on network-level failure
            const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
            if (isNetworkError) {
                console.info('%c[Friends Florist Auth] Network error — falling back to local credentials.', 'color: #2E8B57; font-weight: bold;');
                return this.executeFallback('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword })
                });
            }
            throw error;
        }
    }

    async logout() {
        this.setToken(null);
        return { success: true };
    }

    async getProducts() {
        return this.request('/products', { method: 'GET' });
    }

    async getProduct(id) {
        return this.request(`/products/${id}`, { method: 'GET' });
    }

    async createProduct(productData) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        }, true);
    }

    async updateProduct(id, productData) {
        return this.request(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        }, true);
    }

    async deleteProduct(id) {
        return this.request(`/products/${id}`, {
            method: 'DELETE'
        }, true);
    }

    async getDeals() {
        return this.request('/deals', { method: 'GET' });
    }

    async saveDeals(dealsData) {
        return this.request('/deals', {
            method: 'POST',
            body: JSON.stringify(dealsData)
        }, true);
    }

    async getAlbums() {
        return this.request('/albums', { method: 'GET' });
    }

    async saveAlbums(albumsData) {
        return this.request('/albums', {
            method: 'POST',
            body: JSON.stringify(albumsData)
        }, true);
    }

    async getOrders() {
        return this.request('/orders', { method: 'GET' }, true);
    }

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async updateOrder(id, orderData) {
        return this.request(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(orderData)
        }, true);
    }
}

// Instantiate and expose globally
window.apiClient = new ApiClient();

// Override the instance-level login() patch:
// Now tries the live backend first, then falls back to local credentials.
// This replaces the old GitHub Pages-only patch that bypassed the network entirely.
window.apiClient.login = async function(email, password) {
    const normalizedEmail    = (email    || '').toString().trim().toLowerCase();
    const normalizedPassword = (password || '').toString().trim();

    console.info(
        '%c[Friends Florist Auth] login() — attempting live backend at ' + window.API_BASE_URL + '/admin/login',
        'color: #2E8B57; font-weight: bold;'
    );

    try {
        const response = await fetch(`${window.API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword })
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token || data.accessToken || '';
            localStorage.setItem('ff_jwt_token',  token);
            localStorage.setItem('ff_admin_auth', 'true');
            return { success: true, token, user: data.user || { email: normalizedEmail, role: 'admin' } };
        } else {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.message || `Login failed with status ${response.status}`);
        }
    } catch (networkErr) {
        const isNetworkError = networkErr instanceof TypeError && networkErr.message.includes('fetch');
        if (isNetworkError) {
            // Backend unreachable — fall back to hardcoded admin credentials
            console.warn('%c[Friends Florist Auth] Backend unreachable. Using offline fallback credentials.', 'color: #e05070; font-weight: bold;');
            if (normalizedEmail === 'admin@friendsflorist.com' && normalizedPassword === 'Friends@123') {
                const token = 'mock-jwt-token-admin-friends-florist-2026';
                localStorage.setItem('ff_jwt_token',  token);
                localStorage.setItem('ff_admin_auth', 'true');
                return { success: true, token, user: { email: 'admin@friendsflorist.com', role: 'admin', name: 'Admin' } };
            } else if (
                (normalizedEmail === 'editor@admin.com' || normalizedEmail === 'editor') &&
                normalizedPassword === 'editor'
            ) {
                const token = 'mock-jwt-token-editor-friends-florist-2026';
                localStorage.setItem('ff_jwt_token',  token);
                localStorage.setItem('ff_admin_auth', 'true');
                return { success: true, token, user: { email: 'editor@admin.com', role: 'editor', name: 'Editor' } };
            } else {
                throw new Error('Invalid email or password.');
            }
        }
        throw networkErr;
    }
};

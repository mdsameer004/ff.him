// js/api-client.js
// Modern, Unified REST API Client for Friends Florist

window.API_BASE_URL = window.API_BASE_URL || '/api';
// Set fallback to true by default when live backend is offline to guarantee working demonstration
window.API_FALLBACK = typeof window.API_FALLBACK !== 'undefined' ? window.API_FALLBACK : true;

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
        const url = `${window.API_BASE_URL}${path}`;
        options.headers = { ...this.getHeaders(secured), ...options.headers };

        try {
            // Attempt standard API call
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
            // Check if backend connection failed (or if explicitly forced fallback)
            const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
            if (window.API_FALLBACK && (isNetworkError || error.message.includes('Failed to fetch') || error.message.includes('404'))) {
                console.info(`%c[Friends Florist Backend Fallback] Connecting to simulated client database for path: ${path}`, 'color: #2E8B57; font-weight: bold;');
                return await this.executeFallback(path, options);
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
                        if (email === 'admin@friendsflorist.com' && password === 'Friends@123') {
                            const mockToken = 'mock-jwt-header-token-for-admin-friends-florist';
                            this.setToken(mockToken);
                            resolve({
                                success: true,
                                token: mockToken,
                                user: { email: 'admin@friendsflorist.com', role: 'admin', name: 'Admin User' }
                            });
                        } else if ((email === 'editor@admin.com' || email === 'editor') && password === 'editor') {
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
                            const albums = JSON.parse(localStorage.getItem('albumsData')) || [];
                            resolve(albums);
                        } else if (method === 'POST' || method === 'PUT') {
                            localStorage.setItem('albumsData', JSON.stringify(body));
                            resolve({ success: true, albums: body });
                        }
                        return;
                    }

                    // 5. ORDERS FALLBACK
                    if (path.startsWith('/orders')) {
                        const storedOrders = localStorage.getItem('friends-florist-orders') || localStorage.getItem('orders');
                        let orders = storedOrders ? JSON.parse(storedOrders) : [];
                        
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
                            localStorage.setItem('friends-florist-orders', JSON.stringify(orders));
                            resolve(newOrder);
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
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
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
}

// Instantiate and expose globally
window.apiClient = new ApiClient();

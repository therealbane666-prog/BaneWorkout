// WorkoutBrothers - API Client

const API_BASE = '/.netlify/functions';

// Generic API request function
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    // Add auth token if available
    const token = getToken();
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Une erreur est survenue');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API
const AuthAPI = {
    async register(username, email, password) {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
    },
    
    async login(email, password) {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },
};

// Products API
const ProductsAPI = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/products?${queryString}` : '/products';
        return apiRequest(endpoint);
    },
    
    async getById(id) {
        return apiRequest(`/products/${id}`);
    },
    
    async create(productData) {
        return apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },
    
    async update(id, productData) {
        return apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    },
    
    async delete(id) {
        return apiRequest(`/products/${id}`, {
            method: 'DELETE',
        });
    },
    
    async addReview(id, rating, comment) {
        return apiRequest(`/products/${id}/reviews`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment }),
        });
    },
};

// Cart API
const CartAPI = {
    async get() {
        return apiRequest('/cart');
    },
    
    async addItem(productId, quantity) {
        return apiRequest('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity }),
        });
    },
    
    async updateItem(itemId, quantity) {
        return apiRequest(`/cart/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    },
    
    async removeItem(itemId) {
        return apiRequest(`/cart/items/${itemId}`, {
            method: 'DELETE',
        });
    },
    
    async clear() {
        return apiRequest('/cart', {
            method: 'DELETE',
        });
    },
};

// Orders API
const OrdersAPI = {
    async getAll() {
        return apiRequest('/orders');
    },
    
    async getById(id) {
        return apiRequest(`/orders/${id}`);
    },
    
    async create(shippingAddress, paymentMethod) {
        return apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify({ shippingAddress, paymentMethod }),
        });
    },
    
    async updateStatus(id, status) {
        return apiRequest(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

// Payments API
const PaymentsAPI = {
    async createIntent(orderId) {
        return apiRequest('/payments/create-intent', {
            method: 'POST',
            body: JSON.stringify({ orderId }),
        });
    },
    
    async confirm(paymentIntentId) {
        return apiRequest('/payments/confirm', {
            method: 'POST',
            body: JSON.stringify({ paymentIntentId }),
        });
    },
};

// Admin API
const AdminAPI = {
    async getStats() {
        return apiRequest('/admin/stats');
    },
    
    async triggerReport() {
        return apiRequest('/admin/trigger-report', {
            method: 'POST',
        });
    },
    
    async triggerStockCheck() {
        return apiRequest('/admin/trigger-stock-check', {
            method: 'POST',
        });
    },
};

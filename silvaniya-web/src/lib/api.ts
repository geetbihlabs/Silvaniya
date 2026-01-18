const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'An error occurred');
    }

    return data;
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);

// API endpoints
export const productsApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get('/products', { params }),

  getBySlug: (slug: string) => api.get(`/products/${slug}`),

  getFeatured: (limit = 8) => api.get('/products/featured', { params: { limit } }),

  getNewArrivals: (limit = 8) =>
    api.get('/products/new-arrivals', { params: { limit } }),

  search: (query: string) => api.get('/products/search', { params: { q: query } }),
};

export const categoriesApi = {
  list: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
};

export const cartApi = {
  get: (sessionId: string) =>
    api.get('/cart', { headers: { 'X-Session-Id': sessionId } }),

  addItem: (sessionId: string, variantId: string, quantity: number) =>
    api.post(
      '/cart/items',
      { variantId, quantity },
      { headers: { 'X-Session-Id': sessionId } }
    ),

  updateItem: (sessionId: string, variantId: string, quantity: number) =>
    api.patch(
      `/cart/items/${variantId}`,
      { quantity },
      { headers: { 'X-Session-Id': sessionId } }
    ),

  removeItem: (sessionId: string, variantId: string) =>
    api.delete(`/cart/items/${variantId}`, {
      headers: { 'X-Session-Id': sessionId },
    }),

  applyCoupon: (sessionId: string, code: string) =>
    api.post('/cart/coupon', { code }, { headers: { 'X-Session-Id': sessionId } }),

  removeCoupon: (sessionId: string) =>
    api.delete('/cart/coupon', { headers: { 'X-Session-Id': sessionId } }),
};

export const authApi = {
  sendOtp: (target: string, type: 'phone' | 'email') =>
    api.post('/auth/send-otp', { target, type }),

  verifyOtp: (target: string, otp: string) =>
    api.post('/auth/verify-otp', { target, otp }),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  getProfile: (token: string) =>
    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
};

export const ordersApi = {
  list: (token: string) =>
    api.get('/orders', { headers: { Authorization: `Bearer ${token}` } }),

  getById: (token: string, id: string) =>
    api.get(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }),

  track: (orderNumber: string) => api.get(`/orders/track/${orderNumber}`),
};

export const cmsApi = {
  getBanners: (position?: string) =>
    api.get('/cms/banners', { params: { position } }),
};

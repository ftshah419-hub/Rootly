import apiClient from '../../api/apiClient.js';

export const productService = {
  /**
   * Discover and filter products with geospatial coordinates
   */
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/user/products', { params });
      return response.data || { products: [], pagination: { total: 0, page: 1, pages: 1 } };
    } catch (error) {
      console.warn('productService.getProducts warning:', error.message);
      // Return empty structure so UI can render real empty state
      return { products: [], pagination: { total: 0, page: 1, pages: 1 } };
    }
  },

  /**
   * Get nearby products within radius
   */
  async getNearbyProducts(lat, lng, radius = 5000, type) {
    try {
      const params = {
        latitude: lat,
        longitude: lng,
        radiusKm: radius ? (radius > 100 ? Math.round(radius / 1000) : radius) : 5,
        exchangeType: type && type !== 'ALL' ? type : undefined
      };
      const response = await apiClient.get('/user/products', { params });
      return response.data?.products ? response.data : { products: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.warn('productService.getNearbyProducts warning:', error.message);
      return { products: [] };
    }
  },

  /**
   * Get current user's products
   */
  async getMyProducts() {
    try {
      const response = await apiClient.get('/user/products/my-listings').catch(() => {
        return apiClient.get('/user/my-products');
      });
      return response.data?.products || response.data || [];
    } catch (error) {
      console.warn('productService.getMyProducts warning:', error.message);
      return [];
    }
  },

  /**
   * Toggle product active/paused status
   */
  async toggleProductStatus(id, newStatus) {
    try {
      const response = await apiClient.patch(`/user/products/${id}/status`, {
        status: newStatus,
        availabilityStatus: newStatus
      });
      return response.data?.product || response.data;
    } catch (error) {
      console.warn('productService.toggleProductStatus warning:', error.message);
      return null;
    }
  },

  /**
   * Get single product details by ID
   */
  async getProductById(id) {
    const response = await apiClient.get(`/user/products/${id}`);
    return response.data?.product || response.data;
  },

  /**
   * Create a new produce listing
   */
  async createProduct(productData) {
    const response = await apiClient.post('/user/products', productData);
    return response.data?.product || response.data;
  },

  /**
   * Update existing product listing
   */
  async updateProduct(id, productData) {
    const response = await apiClient.put(`/user/products/${id}`, productData);
    return response.data?.product || response.data;
  },

  /**
   * Toggle product pause status
   */
  async pauseProduct(id, paused = true) {
    const response = await apiClient.patch(`/user/products/${id}/status`, {
      availabilityStatus: paused ? 'PAUSED' : 'AVAILABLE'
    });
    return response.data?.product || response.data;
  },

  /**
   * Mark listing as depleted / sold out
   */
  async markSoldOut(id) {
    const response = await apiClient.patch(`/user/products/${id}/status`, {
      availabilityStatus: 'SOLD_OUT'
    });
    return response.data?.product || response.data;
  },

  /**
   * Delete product listing
   */
  async deleteProduct(id) {
    const response = await apiClient.delete(`/user/products/${id}`);
    return response.data;
  },

  /**
   * Fetch active categories
   */
  async getCategories() {
    try {
      const response = await apiClient.get('/user/categories');
      return response.data?.categories || response.data || [];
    } catch (error) {
      console.warn('productService.getCategories warning:', error.message);
      return [];
    }
  }
};

export default productService;

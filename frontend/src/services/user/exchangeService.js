import apiClient from '../../api/apiClient.js';

export const exchangeService = {
  /**
   * Submit an exchange, buy, or free produce request
   */
  async createExchangeRequest(requestData) {
    const response = await apiClient.post('/user/exchanges', requestData);
    return response.data?.exchangeRequest || response.data;
  },

  /**
   * Get exchange requests with query params
   */
  async getExchangeRequests(params = {}) {
    try {
      const response = await apiClient.get('/user/exchanges', { params });
      return response.data || { requests: [] };
    } catch (error) {
      console.warn('exchangeService.getExchangeRequests warning:', error.message);
      return { requests: [] };
    }
  },

  /**
   * Get requests for current user: 'all' | 'incoming' | 'outgoing'
   */
  async getMyRequests(type = 'all') {
    try {
      const response = await apiClient.get('/user/exchanges', { params: { type } });
      return response.data?.requests || response.data || [];
    } catch (error) {
      console.warn('exchangeService.getMyRequests warning:', error.message);
      return [];
    }
  },

  /**
   * Get single exchange request by ID
   */
  async getExchangeById(id) {
    const response = await apiClient.get(`/user/exchanges/${id}`);
    return response.data?.exchangeRequest || response.data;
  },

  /**
   * Accept, reject, or complete an exchange request
   */
  async updateStatus(id, newStatus, rejectionReason = '') {
    const response = await apiClient.patch(`/user/exchanges/${id}/status`, {
      status: newStatus,
      rejectionReason
    });
    return response.data?.exchangeRequest || response.data;
  },

  /**
   * Alias for updateStatus
   */
  async updateExchangeStatus(id, newStatus, rejectionReason = '') {
    return this.updateStatus(id, newStatus, rejectionReason);
  },

  /**
   * Cancel an outgoing request by the buyer
   */
  async cancelRequest(id) {
    const response = await apiClient.patch(`/user/exchanges/${id}/cancel`);
    return response.data;
  }
};

export default exchangeService;

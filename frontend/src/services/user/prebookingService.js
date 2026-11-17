import apiClient from '../../api/apiClient.js';

export const prebookingService = {
  /**
   * Get user's active prebookings
   */
  async getMyPrebookings() {
    try {
      const response = await apiClient.get('/user/prebookings');
      return response.data?.prebookings || response.data || [];
    } catch (error) {
      console.warn('prebookingService.getMyPrebookings warning:', error.message);
      return [];
    }
  },

  /**
   * Submit prebooking on an upcoming harvest
   */
  async createPrebooking(bookingData) {
    const response = await apiClient.post('/user/prebookings', bookingData);
    return response.data?.prebooking || response.data;
  },

  /**
   * Cancel a pending prebooking
   */
  async cancelPrebooking(id) {
    const response = await apiClient.patch(`/user/prebookings/${id}/cancel`);
    return response.data;
  },

  /**
   * Grower accepts/confirms or fulfills a prebooking
   */
  async updateStatus(id, status) {
    const response = await apiClient.patch(`/user/prebookings/${id}/status`, { status });
    return response.data?.prebooking || response.data;
  }
};

export default prebookingService;

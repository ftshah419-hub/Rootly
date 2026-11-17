import apiClient from '../../api/apiClient.js';

export const reviewService = {
  /**
   * Get reviews for a specific user / grower
   */
  async getUserReviews(userId) {
    try {
      const response = await apiClient.get(`/user/reviews/user/${userId}`);
      return response.data?.reviews || response.data || [];
    } catch (error) {
      console.warn('reviewService.getUserReviews warning:', error.message);
      return [];
    }
  },

  /**
   * Get reviews for a product
   */
  async getProductReviews(productId) {
    try {
      const response = await apiClient.get(`/user/reviews/product/${productId}`);
      return response.data?.reviews || response.data || [];
    } catch (error) {
      console.warn('reviewService.getProductReviews warning:', error.message);
      return [];
    }
  },

  /**
   * Create a review for a completed exchange
   */
  async createReview(reviewData) {
    const response = await apiClient.post('/user/reviews', reviewData);
    return response.data?.review || response.data;
  }
};

export default reviewService;

import apiClient from '../../api/apiClient.js';

export const userService = {
  /**
   * Get current authenticated user profile
   */
  async getProfile() {
    const response = await apiClient.get('/user/profile');
    return response.data?.user || response.data;
  },

  /**
   * Update user profile settings
   */
  async updateProfile(profileData) {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data?.user || response.data;
  },

  /**
   * Get public grower / garden profile by user ID
   */
  async getGardenProfile(userId) {
    const response = await apiClient.get(`/user/profile/${userId}`);
    return response.data?.grower || response.data;
  },

  /**
   * Get user dashboard aggregate data
   */
  async getDashboard() {
    try {
      const response = await apiClient.get('/user/dashboard');
      return response.data;
    } catch (error) {
      console.warn('userService.getDashboard warning:', error.message);
      return null;
    }
  },

  /**
   * Get sustainability impact metrics for current user
   */
  async getSustainabilityMetrics() {
    try {
      const response = await apiClient.get('/user/sustainability');
      return response.data?.metrics || response.data || {
        foodWasteSavedKg: 0,
        foodMilesSavedKm: 0,
        co2eAvertedKg: 0,
        completedExchangesCount: 0
      };
    } catch (error) {
      console.warn('userService.getSustainabilityMetrics warning:', error.message);
      return {
        foodWasteSavedKg: 0,
        foodMilesSavedKm: 0,
        co2eAvertedKg: 0,
        completedExchangesCount: 0
      };
    }
  }
};

export default userService;

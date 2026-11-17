import apiClient from '../../api/apiClient.js';

export const harvestService = {
  /**
   * Get upcoming harvests within a given date window (e.g. 14 to 30 days)
   */
  async getUpcomingHarvests(params = {}) {
    try {
      const queryParams = typeof params === 'number' ? { days: params } : params;
      const response = await apiClient.get('/user/harvests/upcoming', { params: queryParams }).catch(() => {
        return apiClient.get('/user/harvests', { params: queryParams });
      });
      return response.data?.harvests || response.data || [];
    } catch (error) {
      console.warn('harvestService.getUpcomingHarvests warning:', error.message);
      return [];
    }
  },

  /**
   * Get current user's registered upcoming harvests
   */
  async getMyHarvests() {
    try {
      const response = await apiClient.get('/user/harvests/my-harvests');
      return response.data?.harvests || response.data || [];
    } catch (error) {
      console.warn('harvestService.getMyHarvests warning:', error.message);
      return [];
    }
  },

  /**
   * Get single harvest details by ID
   */
  async getHarvestById(id) {
    const response = await apiClient.get(`/user/harvests/${id}`);
    return response.data?.harvest || response.data;
  },

  /**
   * Register a new upcoming crop / harvest announcement
   */
  async createHarvest(harvestData) {
    const response = await apiClient.post('/user/harvests', harvestData);
    return response.data?.harvest || response.data;
  },

  /**
   * Update harvest details, maturity date, or status
   */
  async updateHarvest(id, harvestData) {
    const response = await apiClient.put(`/user/harvests/${id}`, harvestData);
    return response.data?.harvest || response.data;
  },

  /**
   * Delete or archive a harvest record
   */
  async deleteHarvest(id) {
    const response = await apiClient.delete(`/user/harvests/${id}`);
    return response.data;
  }
};

export default harvestService;

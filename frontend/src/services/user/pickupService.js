import apiClient from '../../api/apiClient.js';

export const pickupService = {
  /**
   * Get pickup schedule for an exchange
   */
  async getPickupSchedule(exchangeId) {
    try {
      const response = await apiClient.get(`/user/pickups/${exchangeId}`);
      return response.data?.pickupSchedule || response.data;
    } catch (error) {
      console.warn('pickupService.getPickupSchedule warning:', error.message);
      return null;
    }
  },

  /**
   * Propose a pickup schedule with date, time, location, and optional PIN
   */
  async proposePickup(scheduleData) {
    const response = await apiClient.post('/user/pickups', scheduleData);
    return response.data?.pickupSchedule || response.data;
  },

  /**
   * Confirm or reject the proposed pickup time
   */
  async updatePickupStatus(scheduleId, status, rejectionNote = '') {
    const response = await apiClient.patch(`/user/pickups/${scheduleId}/status`, {
      status,
      rejectionNote
    });
    return response.data?.pickupSchedule || response.data;
  },

  /**
   * Mark the pickup and exchange completed (verifying code/PIN)
   */
  async completePickup(scheduleId, verificationPin = '') {
    const response = await apiClient.post(`/user/pickups/${scheduleId}/complete`, {
      verificationPin
    });
    return response.data;
  }
};

export default pickupService;

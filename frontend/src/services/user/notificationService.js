import apiClient from '../../api/apiClient.js';

export const notificationService = {
  /**
   * Get user notifications
   */
  async getNotifications() {
    try {
      const response = await apiClient.get('/user/notifications');
      return response.data?.notifications || response.data || [];
    } catch (error) {
      console.warn('notificationService.getNotifications warning:', error.message);
      return [];
    }
  },

  /**
   * Mark single notification as read
   */
  async markAsRead(id) {
    const response = await apiClient.patch(`/user/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all user notifications as read
   */
  async markAllAsRead() {
    const response = await apiClient.patch('/user/notifications/read-all');
    return response.data;
  }
};

export default notificationService;

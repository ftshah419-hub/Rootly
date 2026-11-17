import apiClient from '../../api/apiClient.js';

export const chatService = {
  /**
   * Get user's active conversations list
   */
  async getConversations() {
    try {
      const response = await apiClient.get('/user/conversations');
      return response.data?.conversations || response.data || [];
    } catch (error) {
      console.warn('chatService.getConversations warning:', error.message);
      return [];
    }
  },

  /**
   * Get messages for a specific conversation
   */
  async getMessages(conversationId) {
    try {
      const response = await apiClient.get(`/user/conversations/${conversationId}/messages`);
      return response.data?.messages || response.data || [];
    } catch (error) {
      console.warn('chatService.getMessages warning:', error.message);
      return [];
    }
  },

  /**
   * Send a message
   */
  async sendMessage(conversationId, content, messageType = 'TEXT') {
    const response = await apiClient.post(`/user/conversations/${conversationId}/messages`, {
      content,
      messageType
    });
    return response.data?.message || response.data;
  },

  /**
   * Find or initiate a conversation regarding a product or exchange
   */
  async getOrCreateConversation(participantId, productId = null) {
    const response = await apiClient.post('/user/conversations', {
      participantId,
      productId
    });
    return response.data?.conversation || response.data;
  }
};

export default chatService;

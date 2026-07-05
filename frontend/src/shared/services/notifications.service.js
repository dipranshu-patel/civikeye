import api from '../lib/axios';

export const notificationsService = {
    async getUnreadCount() {
        return api.get('/notifications/unread-count');
    },

    async listNotifications(params) {
        return api.get('/notifications', { params });
    },

    async markAllRead() {
        return api.patch('/notifications/read-all');
    },

    async markOneRead(notificationId) {
        return api.patch(`/notifications/${notificationId}/read`);
    }
};

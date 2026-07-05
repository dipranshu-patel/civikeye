import api from '../../../shared/lib/axios';

export const meService = {
    async getProfile() {
        return api.get('/me');
    },

    async updateProfile(data) {
        return api.patch('/me/profile', data);
    },

    async requestEmailChange(newEmail) {
        return api.post('/me/request-email-change', { newEmail });
    },

    async confirmEmailChange(otp) {
        return api.post('/me/confirm-email-change', { otp });
    },
    
    async updateLocation(data) {
        return api.patch('/me/location', data);
    },

    async getPreferences() {
        return api.get('/me/preferences');
    },

    async updatePreferences(data) {
        return api.patch('/me/preferences', data);
    },

    async changePassword(data) {
        return api.post('/me/change-password', data);
    },

    async deleteAccount(data) {
        return api.delete('/me/account', { data });
    }
};

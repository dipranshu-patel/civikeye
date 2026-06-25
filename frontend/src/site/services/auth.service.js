import api from '../lib/axios';

export const authService = {
    async sendOtp(email) {
        const response = await api.post('/auth/send-otp', { email });
        return response.data;
    },

    async verifyOtp(email, otp) {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    },

    async register(fullName, email, password) {
        const response = await api.post('/auth/register', { fullName, email, password });
        return response.data;
    },

    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    }
};

import api from '../../../shared/lib/axios';

export const usersService = {
    async getPublicProfile(userId) {
        return api.get(`/users/${userId}/profile`);
    }
};

import api from '../../../shared/lib/axios';

export const verificationsService = {
    getMyVerifications: (params) => {
        return api.get('/me/verifications', { params });
    },
    
    castVote: (complaintId, data) => {
        return api.post(`/verifications/${complaintId}/vote`, data);
    }
};

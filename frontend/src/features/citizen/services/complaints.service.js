import api from '../../../shared/lib/axios';

export const complaintsService = {
    getPublicCategories: () => {
        return api.get('/sla-categories');
    },
    
    getSimilarComplaints: (lat, lng, categoryId) => {
        return api.get(`/complaints/similar`, {
            params: { lat, lng, category_id: categoryId }
        });
    },
    
    createComplaint: (formData) => {
        return api.post('/complaints', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    exploreComplaints: (params) => {
        return api.get('/complaints', { params });
    },
    
    getComplaintDetail: (id) => {
        return api.get(`/complaints/${id}`);
    },
    
    addUpvote: (id) => {
        return api.post(`/complaints/${id}/upvote`);
    },
    
    removeUpvote: (id) => {
        return api.delete(`/complaints/${id}/upvote`);
    },
    
    getMyComplaints: (params) => {
        return api.get('/me/complaints', { params });
    }
};

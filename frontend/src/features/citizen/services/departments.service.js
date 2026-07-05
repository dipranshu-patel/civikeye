import api from "../../../shared/lib/axios";

export const departmentService = {
    getStats: async () => {
        const response = await api.get("/departments/stats");
        return response.data.data.stats;
    },

    getCategories: async () => {
        const response = await api.get("/departments/categories");
        return response.data.data.categories;
    },

    getDepartments: async () => {
        const response = await api.get("/departments");
        return response.data.data.departments;
    },

    getRecentComplaints: async (departmentId) => {
        const response = await api.get(
            `/departments/${departmentId}/complaints`,
        );
        return response.data.data.complaints;
    },
};

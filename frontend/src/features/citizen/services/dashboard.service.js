import api from "../../../shared/lib/axios";

export const dashboardService = {
    async getDashboardData(lat, lng) {
        const params = {};
        if (lat && lng) {
            params.lat = lat;
            params.lng = lng;
        }
        const response = await api.get("/me/dashboard", { params });
        return response.data;
    },
};

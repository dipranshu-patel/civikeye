import api from "../../../shared/lib/axios";

export const deptService = {
    getDashboardData: () => api.get("/dept/dashboard"),
    getComplaints: (params) => api.get("/dept/complaints", { params }),
    getComplaintDetail: (id) => api.get(`/dept/complaints/${id}`),
    updateComplaintStatus: (id, data) =>
        api.patch(`/dept/complaints/${id}/status`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
};

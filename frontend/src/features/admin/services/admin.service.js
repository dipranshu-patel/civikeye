import api from "../../../shared/lib/axios";

export const adminService = {
    getDashboard: () => api.get("/admin/dashboard"),
    getAuditLogs: (params) => api.get("/admin/audit-logs", { params }),
    getAuditLogDetail: (id) => api.get(`/admin/audit-logs/${id}`),
    
    getDepartments: () => api.get("/admin/departments"),
    createDepartment: (data) => api.post("/admin/departments", data),
    updateDepartmentStatus: (id) => api.patch(`/admin/departments/${id}`),
    resetDepartmentPassword: (id, password) => api.patch(`/admin/departments/${id}/password`, { password }),
    
    getSlaCategories: () => api.get("/admin/sla-categories"),
    createSlaCategory: (data) => api.post("/admin/sla-categories", data),
    updateSlaCategory: (id, data) => api.patch(`/admin/sla-categories/${id}`, data),
};

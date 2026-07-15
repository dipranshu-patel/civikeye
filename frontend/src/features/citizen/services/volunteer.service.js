import api from "../../../shared/lib/axios";

export const volunteerService = {
    discoverTasks: (params) => {
        return api.get("/volunteer/discover", { params });
    },

    claimTask: (taskId) => {
        return api.post(`/volunteer/tasks/${taskId}/claim`);
    },

    completeTask: (taskId, formData) => {
        return api.post(`/volunteer/tasks/${taskId}/complete`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    getMyTasks: (params) => {
        return api.get("/volunteer/my-tasks", { params });
    },

    getImpact: () => {
        return api.get("/volunteer/impact");
    },

    getLeaderboard: (params) => {
        return api.get("/volunteer/leaderboard", { params });
    },
};

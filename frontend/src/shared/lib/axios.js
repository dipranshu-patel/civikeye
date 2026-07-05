import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

const refreshApi = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(error, token) {
    refreshSubscribers.forEach((cb) => cb(error, token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
    refreshSubscribers.push(cb);
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/auth/login') {
                return Promise.reject(error);
            }
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    addRefreshSubscriber((err, token) => {
                        if (err) {
                            reject(err);
                        } else {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        }
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                const response = await refreshApi.post('/auth/refresh');
                const newAccessToken = response.data?.data?.accessToken;
                
                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                    isRefreshing = false;
                    onRefreshed(null, newAccessToken);
                    
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } else {
                    throw new Error("Refresh response missing accessToken");
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                isRefreshing = false;
                onRefreshed(refreshError, null);
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;

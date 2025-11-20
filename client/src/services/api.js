import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with NO timeout for website generation
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds for normal requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Special instance for website generation with longer timeout
const generationApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000, // 5 minutes for website generation
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.error || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

// Same interceptors for generation API
generationApi.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.error || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export const websiteAPI = {
    generate: (data) => generationApi.post('/website/generate', data), // Use special instance
    deploy: (data) => generationApi.post('/website/deploy', data),
};

export const promptsAPI = {
    getTypes: () => api.get('/prompts/types'),
    getBasePrompt: (type) => api.get(`/prompts/base/${type}`),
};

export default api;

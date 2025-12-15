// services/api.ts
import axios from 'axios';
import { API_CONFIG } from '@/config';

// Log the actual URL being used for debugging
if (API_CONFIG.DEBUG) {
    console.log('API Base URL:', API_CONFIG.BASE_URL);
}

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        if (API_CONFIG.DEBUG) {
            console.log('API Request:', {
                url: config.url,
                method: config.method,
                data: config.data,
            });
        }
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        if (API_CONFIG.DEBUG) {
            console.log('API Response:', response.data);
        }
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            message: error.message,
            config: error.config,
            response: error.response?.data,
        });
        return Promise.reject(error);
    }
);

// Test connection to backend
export const testConnection = async () => {
    try {
        console.log('Testing connection to backend...');
        const response = await api.get('/health');
        console.log('API connected successfully:', response.data);
        return true;
    } catch (error: any) {
        console.error('API connection failed:', error.message);
        return false;
    }
};

// Get recommendations from backend
export const fetchRecommendations = async () => {
    try {
        console.log('Fetching recommendations from backend...');
        const response = await api.get('/api/recommendations');
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch recommendations:', error.message);
        throw error;
    }
};

// Send pin action to backend
export const sendPinAction = async (username: string, recommendationId: string, recommendationTitle: string, pinned: boolean) => {
    try {
        console.log(`Sending pin action: ${pinned ? 'PIN' : 'UNPIN'} for ${recommendationTitle}`);
        const response = await api.post('/api/user/pin-recommendation', {
            username,
            recommendation_id: recommendationId,
            recommendation_title: recommendationTitle,
            pinned
        });
        console.log('Pin action saved:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Failed to send pin action:', error.message);
        throw error;
    }
};

export default api;
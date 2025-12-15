// services/api.ts
import axios from 'axios';
import { API_CONFIG } from '@/config';
import {
    DayData,
    MonthlyDayData,
    NightGraphPoint,
    NightGraphEvent,
    Recommendation
} from '@/types';

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

// Sleep data endpoints
export const fetchWeeklyData = async (): Promise<DayData[]> => {
    try {
        console.log('Fetching weekly sleep data...');
        const response = await api.get('/api/sleep/weekly-data');
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch weekly data:', error.message);
        throw error;
    }
};

export const fetchMonthlyData = async (): Promise<MonthlyDayData[]> => {
    try {
        console.log('Fetching monthly sleep data...');
        const response = await api.get('/api/sleep/monthly-data');
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch monthly data:', error.message);
        throw error;
    }
};

export const fetchSleepDistribution = async (): Promise<{
    awake: number;
    pickups: number;
    asleep: number;
}> => {
    try {
        console.log('Fetching sleep distribution data...');
        const response = await api.get('/api/sleep/sleep-distribution');
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch sleep distribution:', error.message);
        throw error;
    }
};

export const fetchSleepScore = async (): Promise<{
    score: number;
    label: string;
}> => {
    try {
        console.log('Fetching sleep score...');
        const response = await api.get('/api/sleep/score');
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch sleep score:', error.message);
        throw error;
    }
};

export const fetchNightPattern = async (): Promise<{
    points: NightGraphPoint[];
    events: NightGraphEvent[];
}> => {
    try {
        console.log('Fetching night pattern data...');
        const response = await api.get('/api/sleep/night-pattern');
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch night pattern:', error.message);
        throw error;
    }
};

// Recommendations endpoints
export const fetchRecommendations = async (): Promise<Recommendation[]> => {
    try {
        console.log('Fetching recommendations from backend...');
        const response = await api.get('/api/recommendations');
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch recommendations:', error.message);
        throw error;
    }
};

export const sendPinAction = async (
    username: string,
    recommendationId: string,
    recommendationTitle: string,
    pinned: boolean
) => {
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

// User profile and settings endpoints
export const sendUserProfile = async (profile: any) => {
    try {
        console.log('Sending profile to backend:', profile);
        const response = await api.post('/api/user/profile', profile);
        return response.data;
    } catch (error: any) {
        console.error('Failed to send profile:', error.message);
        throw error;
    }
};

export const sendUserSettings = async (settings: any) => {
    try {
        console.log('Sending settings to backend:', settings);
        const response = await api.post('/api/user/settings', settings);
        return response.data;
    } catch (error: any) {
        console.error('Failed to send settings:', error.message);
        throw error;
    }
};

export default api;
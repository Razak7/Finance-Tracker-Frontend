import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with auth token
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (userData) => api.post('/auth/login', userData),
    getCurrentUser: () => api.get('/auth/me'),
};

// Expenses API calls
export const expensesAPI = {
    getAll: () => api.get('/expenses'),
    getByRange: (startDate, endDate) => api.get(`/expenses/range?startDate=${startDate}&endDate=${endDate}`),
    create: (expenseData) => api.post('/expenses', expenseData),
    update: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
    delete: (id) => api.delete(`/expenses/${id}`),
};

// Jobs API calls
export const jobsAPI = {
    getAll: () => api.get('/jobs'),
    create: (jobData) => api.post('/jobs', jobData),
    update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
    delete: (id) => api.delete(`/jobs/${id}`),
    getStats: (id) => api.get(`/jobs/${id}/stats`),
};

// Work Entries API calls
export const workEntriesAPI = {
    getAll: () => api.get('/work-entries'),
    create: (workEntryData) => api.post('/work-entries', workEntryData),
    delete: (id) => api.delete(`/work-entries/${id}`),
};

// Salary Payments API calls
export const salaryPaymentsAPI = {
    getAll: () => api.get('/salary-payments'),
    create: (paymentData) => api.post('/salary-payments', paymentData),
    delete: (id) => api.delete(`/salary-payments/${id}`),
};
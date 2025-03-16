import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const baseUrl = 'http://127.0.0.1:8000/api/v1/'
// export const baseUrl = 'https://c62a-2405-4802-1bf3-bfb0-44e8-2055-4d72-7264.ngrok-free.app/api/v1/'


export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    guard?: 'user' | 'patient'; // Thêm guard
    _retry?: boolean; // Logic retry
}
const apiCall: AxiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

const refreshToken = async (guard: 'user' | 'patient') => {
    const endpoint = guard === 'patient' ? 'patient/refresh' : 'auth/refresh';
    try {
        const response = await apiCall.post(endpoint)
        return response.data;
    } catch (error) {
        throw new Error(`Không thể khởi tạo lại access token cho ${guard}`);
    }
}


axios.interceptors.response.use(
    response => {
        return response
    },
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                console.log(originalRequest);
                const guard = originalRequest.guard || 'user';
                const tokenData = await refreshToken(guard);
                // Cập nhật token mới
                axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData.access_token}`;
                return apiCall(originalRequest)

            } catch (error) {
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)

axios.defaults.withCredentials = true
axios.defaults.baseURL = baseUrl
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios


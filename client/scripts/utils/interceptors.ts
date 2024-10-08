// Todo: axios 인터셉터 이해하기
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Token from '@/interfaces/token';
import { setStorageToken } from './storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 설정
api.interceptors.request.use(
    async (config) => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 에러(토큰 만료) 처리
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    // refreshToken을 이용해 새로운 accessToken 요청
                    const response = await axios.post<Token>(`${API_URL}/auth/refresh`, {}, {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                    });

                    // 새로운 accessToken을 AsyncStorage에 저장
                    const newToken = response.data;
                    setStorageToken(newToken);
                    // 원래의 요청을 새로운 accessToken으로 재시도
                    originalRequest.headers.Authorization = `Bearer ${newToken.access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    if (axios.isAxiosError(refreshError)) {
                        console.error('Token refresh error:', refreshError.message);
                    }

                    // refreshToken도 만료된 경우 로그아웃 처리
                    await AsyncStorage.clear();
                    return Promise.reject(refreshError);
                }
            } else {
                await AsyncStorage.clear();
            }
        }

        return Promise.reject(error);
    }
);

export default api;

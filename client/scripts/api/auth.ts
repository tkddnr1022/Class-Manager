import axios from "axios";
import api from "../utils/interceptors";
import User from "@/interfaces/user";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post<{ access_token: string, refresh_token: string }>(
            `${API_URL}/auth/signin`,
            { email: email, password: password }
        );
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.status, error.message, error.response?.data);
        }
    }
}

export const getProfile = async () => {
    try {
        const response = await api.get<User>(`${API_URL}/auth/profile`);

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.status, error.message, error.response?.data);
        } else {
            console.error(error);
        }
    }
};

export const sendEmail = async () => {
    try {
        const response = await api.post<{ isSuccess: boolean }>(`${API_URL}/auth/send-email`);

        if (response.status === 201) {
            return response.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.status, error.message, error.response?.data);
        } else {
            console.error(error);
        }
    }
};

export const verifyEmail = async (code: string) => {
    try {
        const response = await api.post<{ isSuccess: boolean }>(`${API_URL}/auth/verify-email`, { code });

        if (response.status === 201) {
            return response.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.status, error.message, error.response?.data);
        } else {
            console.error(error);
        }
    }
};
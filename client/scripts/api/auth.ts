import { API_URL } from "@env";
import axios from "axios";
import api from "../utils/interceptors";
import User from "@/interfaces/user";

export const signIn = async (email: string, password: string) => {
    try {
        const response = await api.post<{ access_token: string, refresh_token: string }>(
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
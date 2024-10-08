import User from "@/interfaces/user";
import axios from "axios";
import api from "../utils/interceptors";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const updateUser = async (userId: string, user: { username: string, email: string, password: string, studentId: string }) => {
    try {
        const response = await api.put<User>(`${API_URL}/user/${userId}`, {
            username: user.username,
            email: user.email,
            studentId: user.studentId,
            password: user.password.length ? user.password : undefined,
        });

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
}
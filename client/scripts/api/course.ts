import axios from "axios";
import api from "../utils/interceptors";
import Course from "@/interfaces/course";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getCourseByUserId = async (userId: string) => {
    try {
        const response = await api.get<Course[]>(`${API_URL}/course/user/${userId}`);

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
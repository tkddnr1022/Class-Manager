import Health from "@/interfaces/health";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const healthCheck = async () => {
    try {
        const response = await axios.get<Health>(`${API_URL}/health`, { timeout: 7000 });

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
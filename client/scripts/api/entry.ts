import { API_URL } from "@env";
import axios from "axios";
import api from "../utils/interceptors";
import Entry from "@/interfaces/entry";

export const getEntryByUserId = async (userId: string) => {
    try {
        const response = await api.get<Entry[]>(`${API_URL}/entry/user/${userId}`);

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
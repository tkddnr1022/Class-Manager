import axios from "axios";
import api from "../utils/interceptors";
import Entry from "@/interfaces/entry";
import { Coordinate } from "@/interfaces/course";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

export const getEntryByCourseId = async (courseId: string) => {
    try {
        const response = await api.get<Entry[]>(`${API_URL}/entry/course/${courseId}`);

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

export const createEntry = async (entry: { courseId: string, location: Coordinate, deviceId: string }) => {
    try {
        const response = await api.post<Entry>(`${API_URL}/entry`, entry);

        if (response.status === 201) {
            return "success";
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.status, error.message, error.response?.data);
            if (error.response) {
                return error.response.data.message;
            }
        } else {
            console.error(error);
            return error;
        }
    }
}
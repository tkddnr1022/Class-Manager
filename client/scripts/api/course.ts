import axios from "axios";
import api from "../utils/interceptors";
import Course, { Coordinate } from "@/interfaces/course";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getCourse = async (courseId: string) => {
    try {
        const response = await api.get<Course>(`${API_URL}/course/${courseId}`);

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

export const createCourse = async (course: { title: string, startAt: Date, endAt: Date, location: Coordinate }) => {
    try {
        const response = await api.post<Course>(`${API_URL}/course`, course);

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

export const deleteCourse = async (courseId: string) => {
    try {
        const response = await api.delete<Course>(`${API_URL}/course/${courseId}`);

        if (response.status === 200) {
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
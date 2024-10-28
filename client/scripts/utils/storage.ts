import Token from "@/interfaces/token";
import User from "@/interfaces/user"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const getStorageProfile = async () => {
    try {
        const store = await AsyncStorage.getItem('profile');
        if (!store) {
            return;
        }
        const profile: User = JSON.parse(store);
        return profile;
    } catch (error) {
        console.error(error);
    }
}

export const setStorageProfile = async (profile: User) => {
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
}

export const getStorageToken = async () => {
    try {
        const store = await AsyncStorage.getItem('token');
        if (!store) {
            return;
        }
        const token: Token = JSON.parse(store);
        return token;
    } catch (error) {
        console.error(error);
    }
}

export const setStorageToken = async (token: Token) => {
    await AsyncStorage.setItem('token', JSON.stringify(token));
}

export const removeStorageToken = async () => {
    await AsyncStorage.removeItem('token');
}
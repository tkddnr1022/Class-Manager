import Token from "@/interfaces/token";
import User from "@/interfaces/user"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const getStorageProfile = async () => {
    try {
        const profile: User = {
            _id: await AsyncStorage.getItem('userId') as string,
            email: await AsyncStorage.getItem('email') as string,
            roles: [await AsyncStorage.getItem('userRole') as string],
            studentId: await AsyncStorage.getItem('studentId') || undefined,
            username: await AsyncStorage.getItem('username') || undefined,
        }
        return profile;
    } catch (error) {
        console.error(error);
    }
}

export const setStorageProfile = async (profile: User) => {
    await AsyncStorage.setItem('userRole', JSON.stringify(profile.roles));
    await AsyncStorage.setItem('userId', profile._id);
    await AsyncStorage.setItem('email', profile.email);
    if(profile.username && profile.studentId){
        await AsyncStorage.setItem('username', profile.username);
        await AsyncStorage.setItem('studentId', profile.studentId);
    }
}

export const getStorageToken = async () => {
    try {
        const token: Token = {
            access_token: await AsyncStorage.getItem('accessToken') as string,
            refresh_token: await AsyncStorage.getItem('refreshToken') as string,
        }
        return token;
    } catch (error) {
        console.error(error);
    }
}

export const setStorageToken = async (token: Token) => {
    await AsyncStorage.setItem('accessToken', token.access_token);
    await AsyncStorage.setItem('refreshToken', token.refresh_token);
}
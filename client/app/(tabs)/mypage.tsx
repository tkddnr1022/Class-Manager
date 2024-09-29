import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function Mypage() {
    const [loading, setLoading] = useState(false);

    const logoutHandler = async () => {
        setLoading(true);
        await AsyncStorage.clear();
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        Toast.show({
            type: 'success',
            text1: '로그아웃 되었습니다.'
        });
        setLoading(false);
        router.replace('/login');
    }

    return (
        <View style={styles.container}>
            <Button
                mode="contained-tonal"
                onPress={logoutHandler}
                loading={loading}
                disabled={loading}
            >
                로그아웃
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
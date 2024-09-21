import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Mypage() {

    const logoutHandler = async () => {
        await AsyncStorage.clear();
        router.replace('/login');
    }

    return (
        <View style={styles.container}>
            <Button mode="contained-tonal" onPress={logoutHandler}>로그아웃</Button>
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
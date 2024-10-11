import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Home() {

    const cameraHandler = () => {
        router.navigate('/camera');
    }

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={cameraHandler}>카메라</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
    },
});
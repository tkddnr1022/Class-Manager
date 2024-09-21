import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Home() {

    const removeStorage = async () => {
        await AsyncStorage.clear();
    }

    return (
        <View style={styles.container}>
            <Link href={"/camera"} style={styles.button}>
                <Text style={styles.text}>카메라</Text>
            </Link>
            <Link href={"/qrcode"} style={styles.button}>
                <Text style={styles.text}>QR코드</Text>
            </Link>
            <Button mode="contained-tonal" onPress={removeStorage}>remove storage</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        margin: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
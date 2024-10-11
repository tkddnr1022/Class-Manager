import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Home() {

    return (
        <View style={styles.container}>
            <Button mode="contained-tonal">설정</Button>
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
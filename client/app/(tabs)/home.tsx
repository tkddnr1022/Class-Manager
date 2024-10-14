import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";

export default function Home() {

    const cameraHandler = () => {
        router.navigate('/camera');
    }

    return (
        <View style={styles.container}>
            <Button mode="contained" onPress={cameraHandler}>카메라</Button>
            <Card>
                <Card.Content>
                    <Text>test</Text>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
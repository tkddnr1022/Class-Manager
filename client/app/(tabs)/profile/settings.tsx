import { useTheme } from "@/app/_layout";
import { View, StyleSheet, Switch } from "react-native";
import { Divider, List } from "react-native-paper";

export default function Settings() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <View style={styles.container}>

            <List.Section>
                <List.Subheader>앱 설정</List.Subheader>
                <List.Item
                    title="다크 모드"
                    left={() => <List.Icon icon="theme-light-dark" />}
                    right={() => (
                        <Switch value={isDark} onValueChange={toggleTheme} />
                    )}
                />
                <Divider />

                <List.Item
                    title="앱 버전"
                    description="1.0.0"
                    left={() => <List.Icon icon="information" />}
                />
            </List.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
});
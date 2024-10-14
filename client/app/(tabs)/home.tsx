import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";

export default function Home() {

    const goToCamera = () => {
        router.navigate('/camera');
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="변경사항" titleVariant="titleMedium"/>
                <Card.Content>
                    <Text>- 최초 버전</Text>
                    <Text>- 출석 및 수업 관리</Text>
                </Card.Content>
            </Card>
            <Card style={styles.card}>
                <Card.Title title="구현예정" titleVariant="titleMedium"/>
                <Card.Content>
                    <Text>- 소셜 로그인</Text>
                    <Text>- 헤더 뒤로가기 버튼</Text>
                    <Text>- 웹 최적화</Text>
                    <Text>- 다양한 관리 기능</Text>
                    <Text>- UI 개선</Text>
                </Card.Content>
            </Card>
            <Card style={styles.card}>
                <Card.Title title="이슈" titleVariant="titleMedium"/>
                <Card.Content>
                    <Text>- 권한 거부 시 수동 설정 필요</Text>
                    <Text>- 네트워크 에러 예외처리 부족</Text>
                    <Text>- 리스트 가독성 개선 필요</Text>
                </Card.Content>
            </Card>
            <Button mode="contained" onPress={goToCamera} icon="camera" labelStyle={{lineHeight: 16}} style={styles.button}>카메라 열기</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
    card: {
        width: "100%",
        marginBottom: 24,
    },
    button: {
        paddingVertical: 4,
        borderRadius: 12,
    }
});
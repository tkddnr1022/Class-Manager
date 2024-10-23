import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getStorageProfile, removeStorageToken, setStorageProfile } from '@/scripts/utils/storage';
import { updateUser } from '@/scripts/api/user';

export default function OAuthProfile() {
    const [username, setUsername] = useState('');
    const [studentId, setStudentId] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const handleSubmit = async () => {
        setSubmitLoading(true);
        try {
            const profile = await getStorageProfile();
            if(!profile){
                throw new Error();
            }
            const userId = profile._id;
            const update = await updateUser(userId, { username, studentId });
            if (update) {
                Toast.show({
                    type: 'success',
                    text1: '가입 성공',
                    text2: '회원정보 입력이 완료되었습니다.'
                });
                await setStorageProfile(update);
                return router.replace('/(tabs)/home');
            }
            else {
                throw new Error(update);
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: '가입 실패',
                text2: error.toString(),
            });
            console.error(error.toString());
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        await removeStorageToken();
        Toast.show({
            type: 'success',
            text1: '로그아웃 되었습니다.'
        });
        setLogoutLoading(false);
        router.replace('/login');
    }

    const isFormValid = () => {
        return (
            username.length > 0 &&
            studentId.length > 0
        );
    };

    return (
        <View style={styles.container}>
            <Card mode="contained" style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>소셜로그인 연동</Text>
                    <TextInput
                        label="이름"
                        value={username}
                        onChangeText={setUsername}
                        disabled={submitLoading || logoutLoading}
                        style={styles.input}
                    />
                    <TextInput
                        label="학번"
                        value={studentId}
                        onChangeText={setStudentId}
                        disabled={submitLoading || logoutLoading}
                        style={styles.input}
                        keyboardType='numeric'
                    />
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        disabled={submitLoading || logoutLoading || !isFormValid()}
                        loading={submitLoading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        확인
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleLogout}
                        disabled={submitLoading || logoutLoading}
                        loading={logoutLoading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        로그아웃
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 36,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 16,
        borderRadius: 12,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    errorMessage: {
        color: 'red',
        textAlign: 'left',
    },
    successMessage: {
        color: 'green',
        textAlign: 'left',
    },
    card: {
        width: '100%',
        paddingHorizontal: 4,
        paddingVertical: 8,
    },
});

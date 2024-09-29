import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        // Todo: 실제 로그인 API 호출
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (email === 'test@test.com' && password === 'testpw') {
            try {
                await AsyncStorage.setItem('userToken', 'dummy-auth-token');
                Toast.show({
                    type: 'success',
                    text1: '로그인 성공',
                })
                router.replace('/(tabs)/home'); // 로그인 성공 시 Home 화면으로 이동
            } catch (e) {
                console.error(e);
            }
        } else {
            Toast.show({
                type: 'error',
                text1: '로그인 실패',
                text2: '이메일 혹은 비밀번호가 올바르지 않습니다.'
            })
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>로그인</Text>
            <TextInput
                label="이메일"
                disabled={loading}
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                label="비밀번호"
                disabled={loading}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
            />
            <Button
                mode="contained"
                disabled={loading}
                loading={loading}
                onPress={handleLogin}
                style={styles.button}
                contentStyle={styles.buttonContent}
            >
                로그인
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 32,
        color: '#6200ee',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        zIndex: 1,
    },
});
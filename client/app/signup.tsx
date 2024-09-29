import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import debounce from 'lodash.debounce';
import Toast from 'react-native-toast-message';

export default function Signup() {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [emailChecking, setEmailChecking] = useState(false);

    const checkEmailDuplicate = async (email: string) => {
        setEmailChecking(true);
        // Todo: 실제 이메일 중복 확인 API 호출
        // for dev
        if (email === 'test@test.com') {
            setEmailValid(false);
            setEmailMessage('중복된 이메일입니다.');
        } else {
            setEmailValid(true);
            setEmailMessage('사용 가능한 이메일입니다.');
        }
        setEmailChecking(false);
    };

    const validateEmailFormat = (email: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const debouncedCheckEmail = useCallback(debounce((email: string) => {
        if (validateEmailFormat(email)) {
            checkEmailDuplicate(email);
        } else {
            setEmailValid(false);
            setEmailMessage('올바른 이메일 형식이 아닙니다.');
        }
    }, 500), []);

    useEffect(() => {
        if (email) {
            debouncedCheckEmail(email);
        } else {
            setEmailValid(true);
            setEmailMessage('');
        }
        return () => {
            debouncedCheckEmail.cancel();
        };
    }, [email]);

    useEffect(() => {
        if (password && confirmPassword) {
            setPasswordMatch(password === confirmPassword);
        } else {
            setPasswordMatch(true);
        }
    }, [password, confirmPassword]);

    const handleSignup = async () => {
        if (!passwordMatch) {
            setEmailMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        // Todo: 실제 회원가입 API 호출
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            await AsyncStorage.setItem('userToken', 'dummy-auth-token');
            Toast.show({
                type: 'success',
                text1: '가입 성공',
                text2: '회원가입이 완료되었습니다.'
            });
            router.replace('/(tabs)/home');
        } catch (e: any) {
            Toast.show({
                type: 'error',
                text1: '가입 실패',
                text2: e.toString()
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return (
            name.length > 0 &&
            studentId.length > 0 &&
            emailValid &&
            email.length > 0 &&
            passwordMatch &&
            password.length > 0 &&
            confirmPassword.length > 0
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원가입</Text>
            <TextInput
                label="이름"
                value={name}
                onChangeText={setName}
                disabled={loading}
                style={styles.input}
            />
            <TextInput
                label="학번"
                value={studentId}
                onChangeText={setStudentId}
                disabled={loading}
                style={styles.input}
                keyboardType='numeric'
            />
            <TextInput
                label="이메일"
                value={email}
                onChangeText={setEmail}
                disabled={loading}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!emailValid && !!email}
            />
            {!emailValid && <Text style={styles.errorMessage}>{emailMessage}</Text>}
            <TextInput
                label="비밀번호"
                value={password}
                onChangeText={setPassword}
                disabled={loading}
                secureTextEntry
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                label="비밀번호 확인"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                disabled={loading}
                secureTextEntry
                style={styles.input}
                autoCapitalize="none"
                error={!passwordMatch && !!confirmPassword}
            />
            {!passwordMatch && <Text style={styles.errorMessage}>비밀번호가 일치하지 않습니다.</Text>}
            <Button
                mode="contained"
                onPress={handleSignup}
                disabled={loading || !isFormValid()}
                loading={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
            >
                회원가입
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
    errorMessage: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'left',
    },
});

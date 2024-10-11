import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import debounce from 'lodash.debounce';
import Toast from 'react-native-toast-message';
import { checkEmail, signUp } from '@/scripts/api/user';
import { getProfile, signIn } from '@/scripts/api/auth';
import { setStorageProfile, setStorageToken } from '@/scripts/utils/storage';
import { Colors } from '@/constants/Colors';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [loading, setLoading] = useState(false);

    const checkEmailDuplicate = async (email: string) => {
        const isEmailTaken = await checkEmail(email);
        if (isEmailTaken == true) {
            setEmailValid(false);
            setEmailMessage('이미 사용중인 이메일입니다.');
        }
        else if (isEmailTaken == false) {
            setEmailValid(true);
            setEmailMessage('사용 가능한 이메일입니다.');
        }
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
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const result = await signUp({ username, email, password, studentId });
            if (result == "success") {
                Toast.show({
                    type: 'success',
                    text1: '가입 성공',
                    text2: '회원가입이 완료되었습니다.'
                });
                const token = await signIn(email, password);
                if (token) {
                    await setStorageToken(token);
                }
                const profile = await getProfile();
                if (profile) {
                    await setStorageProfile(profile);
                    // Todo: 뒤로가기 시 히스토리 남아있는 문제 해결
                    return router.replace('/(tabs)/home');
                }
                // 회원가입 성공했으나 로그인 실패 상황
                return router.back();
            }
            else {
                throw new Error(result);
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: '가입 실패',
                text2: error.toString(),
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return (
            username.length > 0 &&
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
                value={username}
                onChangeText={setUsername}
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
            {emailValid && <Text style={styles.successMessage}>{emailMessage}</Text>}
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
            {passwordMatch && confirmPassword && <Text style={styles.successMessage}>비밀번호가 일치합니다.</Text>}
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
        padding: 36,
        backgroundColor: Colors.light.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 16,
        backgroundColor: Colors.light.tint,
        borderRadius: 12,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'left',
    },
    successMessage: {
        color: 'green',
        marginBottom: 8,
        textAlign: 'left',
    },
});

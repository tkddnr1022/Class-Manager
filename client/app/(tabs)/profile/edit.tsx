import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const EditProfile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log({
            username, email, studentId
        });
        Toast.show({
            type: 'success',
            text1: '수정 성공',
            text2: '회원정보가 수정되었습니다.',
        });
        setLoading(false);
        router.back();
    };

    const getUser = async () => {
        // Todo: API 요청 구현
        setUsername('testuser');
        setEmail('test@test.com');
        setStudentId('201911858');
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원정보 수정하기</Text>
            <View style={styles.row}>
                <TextInput
                    style={{ flex: 1 }}
                    label="이름"
                    value={username}
                    onChangeText={setUsername}
                    disabled={loading}
                />
            </View>
            <View style={styles.row}>
                <TextInput
                    style={{ flex: 1 }}
                    label="이메일"
                    value={email}
                    onChangeText={setEmail}
                    disabled={loading}
                />
            </View>
            <View style={styles.row}>
                <TextInput
                    style={{ flex: 1 }}
                    label="학번"
                    value={studentId}
                    onChangeText={setStudentId}
                    disabled={loading}
                />
            </View>
            <Button
                mode="contained-tonal"
                onPress={handleSubmit}
                disabled={loading}
                loading={loading}
            >
                수정
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        marginRight: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
});

export default EditProfile;

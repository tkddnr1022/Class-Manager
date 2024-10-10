import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { updateUser } from '@/scripts/api/user';
import { getStorageProfile, setStorageProfile } from '@/scripts/utils/storage';
import eventEmitter from '@/scripts/utils/eventEmitter';

const EditProfile = () => {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const update = await updateUser(userId, { username, email, password, studentId });
            if (update) {
                await setStorageProfile(update);
                Toast.show({
                    type: 'success',
                    text1: '수정 성공',
                    text2: '회원정보가 수정되었습니다.',
                });
            }
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
        eventEmitter.emit('refresh_profile');
        router.back();
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const profile = await getStorageProfile();
            if (profile) {
                setUserId(profile._id);
                setUsername(profile.username);
                setStudentId(profile.studentId);
                setEmail(profile.email);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

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
                    label="비밀번호"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
});

export default EditProfile;

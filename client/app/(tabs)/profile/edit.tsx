import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { updateUser } from '@/scripts/api/user';
import { getStorageProfile, setStorageProfile } from '@/scripts/utils/storage';
import eventEmitter from '@/scripts/utils/eventEmitter';

const EditProfile = () => {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState<string | undefined>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [studentId, setStudentId] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
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
            <Card mode="contained" style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Text style={styles.title}>회원정보 수정하기</Text>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            label="이름"
                            value={username}
                            onChangeText={setUsername}
                            disabled={loading}
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            label="이메일"
                            value={email}
                            onChangeText={setEmail}
                            disabled={loading}
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
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
                            style={styles.input}
                            label="학번"
                            value={studentId}
                            onChangeText={setStudentId}
                            disabled={loading}
                        />
                    </View>
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        icon={'check'}
                        disabled={loading}
                        loading={loading}
                        style={styles.button}
                        labelStyle={{lineHeight: 18}}
                    >
                        수정
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
        alignItems: 'center',
        padding: 18,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        fontWeight: 'bold',
    },
    row: {
        width: '100%',
        marginBottom: 8,
    },
    input: {
        fontSize: 16,
    },
    button: {
        width: '100%',
        marginTop: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    card: {
        width: '100%',
        paddingHorizontal: 4,
        paddingVertical: 8,
    },
    cardContent: {
        alignItems: 'center',
    },
});

export default EditProfile;

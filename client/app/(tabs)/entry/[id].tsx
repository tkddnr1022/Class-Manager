import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Course from '@/interfaces/course';
import { Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { getCourse } from '@/scripts/api/course';
import eventEmitter from '@/scripts/utils/eventEmitter';
import { createEntry } from '@/scripts/api/entry';
import { getCurrentPositionAsync, useForegroundPermissions } from 'expo-location';
import * as Application from 'expo-application';
import { Colors } from '@/constants/Colors';

const EntryDetails = () => {
    const { id } = useLocalSearchParams();
    const [course, setCourse] = useState<Course>();
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [locPermission, requestLocPermission] = useForegroundPermissions(); // 위치 권한

    // Todo: 권한 거부 시 동작
    useEffect(() => {
        fetchCourse();
        requestLocPermission();
    }, [id]);

    const fetchCourse = async () => {
        setLoading(true);
        if (!id) {
            setLoading(false);
            return;
        }
        const courseId = id as string;
        const course = await getCourse(courseId);
        setCourse(course);
        setLoading(false);
    }

    const handleSubmit = async () => {
        setSubmitLoading(true);
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        const courseId = id as string;

        if(!locPermission?.granted){
            Toast.show({
                type: 'info',
                text1: '권한 요청',
                text2: '위치 정보 권한을 허용해주세요.',
            });
            requestLocPermission();
            return setSubmitLoading(false);
        }
        const { latitude, longitude } = (await getCurrentPositionAsync()).coords;
        const location = { lat: latitude, lon: longitude };
        if (!location) {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '위치 정보를 불러올 수 없습니다.',
            });
            return setSubmitLoading(false);
        }

        let deviceId = null;
        if (Platform.OS === 'android') {
            deviceId = Application.getAndroidId();
        } else if (Platform.OS === 'ios') {
            deviceId = await Application.getIosIdForVendorAsync();
        }
        if (!deviceId) {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '디바이스 ID를 가져올 수 없습니다.',
            });
            return setSubmitLoading(false);
        }

        const result = await createEntry({ courseId, location, deviceId });
        if (result == 'success') {
            Toast.show({
                type: 'success',
                text1: '출석 완료',
                text2: '출석이 정상적으로 완료되었습니다.',
            });
            eventEmitter.emit('refresh_entry');
            return router.replace('/(tabs)/entry');
        }
        else if (result == 'ERROR_USER_ID') {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '이미 출석한 수업입니다.',
            });
        }
        else if (result == 'ERROR_DEVICE_ID') {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '디바이스 ID 중복 오류',
            });
        }
        else if (result == 'ERROR_LOCATION_RANGE') {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '출석 위치 범위 밖입니다.',
            });
        }
        else if (result == 'ERROR_START_TIME' || result == 'ERROR_END_TIME') {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '출석 가능한 시간이 아닙니다.',
            });
        }
        else {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: result,
            });
        }
        setSubmitLoading(false);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} size={'large'} />
                    <Text>불러오는 중..</Text>
                </View>
            ) : (<>
                {course ? (
                    <>
                        <Card style={styles.card}>
                            <TouchableOpacity
                                style={styles.closeIcon}
                                onPress={() => router.replace('/(tabs)/entry')}
                            >
                                <MaterialIcons name="close" size={24} color="black" />
                            </TouchableOpacity>
                            <Card.Content>
                                <View style={styles.row}>
                                    <Text style={styles.title}>{course.title}</Text>
                                </View>
                                <View style={styles.row}>
                                    <MaterialIcons name="access-time" size={20} color="#4f4f4f" />
                                    <Text style={styles.detail}>시작 시간: {new Date(course.startAt).toLocaleString('ko-KR')}</Text>
                                </View>
                                <View style={styles.row}>
                                    <MaterialIcons name="access-time" size={20} color="#4f4f4f" />
                                    <Text style={styles.detail}>종료 시간: {new Date(course.endAt).toLocaleString('ko-KR')}</Text>
                                </View>
                                <View style={styles.row}>
                                    <MaterialIcons name="location-on" size={20} color="#4f4f4f" />
                                    <Text style={styles.detail}>위치: {course.location.lat}, {course.location.lon}</Text>
                                </View>
                            </Card.Content>
                        </Card>
                        <Button
                            style={styles.submitButton}
                            mode="contained"
                            onPress={handleSubmit}
                            icon="check"
                            loading={submitLoading}
                            disabled={submitLoading}
                            labelStyle={{ fontSize: 16 }}
                        >
                            출석하기
                        </Button>
                    </>
                ) : (
                    <Text>수업 정보를 불러올 수 없습니다.</Text>
                )}
            </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: 12,
        width: '100%',
        marginBottom: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        elevation: 5,
    },
    closeIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    detail: {
        fontSize: 16,
        color: '#4f4f4f',
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        width: '100%',
        paddingVertical: 6,
        backgroundColor: Colors.light.tint,
        borderRadius: 12,
    },
});

export default EntryDetails;

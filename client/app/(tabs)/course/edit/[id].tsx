import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Coordinate } from '@/interfaces/course';
import { getCurrentPositionAsync, useForegroundPermissions } from 'expo-location';
import Toast from 'react-native-toast-message';
import { getCourse, updateCourse } from '@/scripts/api/course';
import eventEmitter from '@/scripts/utils/eventEmitter';

const EditCourse = () => {
    const { id } = useLocalSearchParams();
    const [title, setTitle] = useState('');
    const [startAt, setStartAt] = useState<Date>(new Date());
    const [endAt, setEndAt] = useState<Date>(new Date(Date.now() + 3600000));
    const [location, setLocation] = useState<Coordinate>();
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);
    const [locPermission, requestLocPermission] = useForegroundPermissions(); // 위치 권한
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);
    const [result, setResult] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, []);

    const handleStartDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || startAt;
        setStartAt(currentDate);
        setShowStartDate(false);
    };

    const handleEndDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || endAt;
        setEndAt(currentDate);
        setShowEndDate(false);
    };

    const handleStartTimeChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || startAt;
        if (startAt) {
            currentDate.setFullYear(startAt.getFullYear(), startAt.getMonth(), startAt.getDate());
        }
        setStartAt(currentDate);
        setShowStartTime(false);
    };

    const handleEndTimeChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || endAt;
        if (endAt) {
            currentDate.setFullYear(endAt.getFullYear(), endAt.getMonth(), endAt.getDate());
        }
        setEndAt(currentDate);
        setShowEndTime(false);
    };

    const fetchCourse = async () => {
        setLoading(true);
        if (!id) {
            setLoading(false);
            return;
        }
        const courseId = id as string;
        const course = await getCourse(courseId);
        if (course) {
            setResult(true);
            setTitle(course.title);
            setStartAt(new Date(course.startAt));
            setEndAt(new Date(course.endAt));
            setLocation(course.location);
        }
        setLoading(false);
    }

    const handleSubmit = async () => {
        if (submitLoading) {
            return;
        }
        setSubmitLoading(true);
        if (!location) {
            Toast.show({
                type: 'error',
                text1: '수정 실패',
                text2: '위치값이 유효하지 않습니다.',
            });
            return;
        }
        if (!title) {
            Toast.show({
                type: 'error',
                text1: '수정 실패',
                text2: '수업 이름을 입력해주세요.',
            });
            return;
        }
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        const courseId = id as string;
        const result = await updateCourse(courseId, { title, startAt, endAt, location });
        if (result == "success") {
            Toast.show({
                type: 'success',
                text1: '수정 성공',
                text2: '수업이 수정되었습니다.',
            });
            setSubmitLoading(false);
            eventEmitter.emit('refresh_courseDetail');
            return router.back();
        }
        else {
            Toast.show({
                type: 'error',
                text1: '수정 실패',
                text2: result.toString(),
            });
            setSubmitLoading(false);
        }
    };

    const getCurrentLocation = async () => {
        setLocLoading(true);
        const { granted } = await requestLocPermission();
        if (!granted) {
            // Todo: 권한 거부 시 동작
            setLocLoading(false);
            return;
        }
        const { latitude, longitude } = (await getCurrentPositionAsync()).coords;
        setLocation({ lat: latitude, lon: longitude });
        setLocLoading(false);
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} size={'large'} />
                    <Text>불러오는 중..</Text>
                </View>
            ) : (
                <>
                    {result ? (
                        <>
                            <Text style={styles.title}>수업 수정하기</Text>
                            <View style={styles.row}>
                                <TextInput
                                    style={styles.inputFlex}
                                    label="수업 이름"
                                    value={title}
                                    onChangeText={setTitle}
                                    disabled={submitLoading}
                                />
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    onPress={() => setShowStartDate(true)}
                                    style={styles.datePicker}
                                    disabled={submitLoading}
                                >
                                    <TextInput
                                        label="시작 날짜"
                                        value={new Date(startAt).toLocaleDateString()}
                                        editable={false}
                                        style={styles.input}
                                    />
                                </TouchableOpacity>
                                {showStartDate && (
                                    <DateTimePicker
                                        value={startAt}
                                        mode="date"
                                        display="default"
                                        onChange={handleStartDateChange}
                                    />
                                )}
                                <TouchableOpacity
                                    onPress={() => setShowStartTime(true)}
                                    style={styles.timePicker}
                                    disabled={submitLoading}
                                >
                                    <TextInput
                                        label="시작 시간"
                                        value={new Date(startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        editable={false}
                                        style={styles.input}
                                    />
                                </TouchableOpacity>
                                {showStartTime && (
                                    <DateTimePicker
                                        value={startAt}
                                        mode="time"
                                        display="default"
                                        onChange={handleStartTimeChange}
                                    />
                                )}
                            </View>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    onPress={() => setShowEndDate(true)}
                                    style={styles.datePicker}
                                    disabled={submitLoading}
                                >
                                    <TextInput
                                        label="종료 날짜"
                                        value={new Date(endAt).toLocaleDateString()}
                                        editable={false}
                                        style={styles.input}
                                    />
                                </TouchableOpacity>
                                {showEndDate && (
                                    <DateTimePicker
                                        value={endAt}
                                        mode="date"
                                        display="default"
                                        onChange={handleEndDateChange}
                                        locale='ko-KR'
                                    />
                                )}
                                <TouchableOpacity
                                    onPress={() => setShowEndTime(true)}
                                    style={styles.timePicker}
                                    disabled={submitLoading}
                                >
                                    <TextInput
                                        label="종료 시간"
                                        value={new Date(endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        editable={false}
                                        style={styles.input}
                                    />
                                </TouchableOpacity>
                                {showEndTime && (
                                    <DateTimePicker
                                        value={endAt}
                                        mode="time"
                                        display="default"
                                        onChange={handleEndTimeChange}
                                    />
                                )}
                            </View>

                            <View style={styles.row}>
                                <TextInput
                                    style={styles.inputFlex}
                                    label="위치"
                                    value={`${location?.lat}, ${location?.lon}`}
                                    editable={false}
                                />
                                <Button
                                    mode="contained"
                                    icon="crosshairs-gps"
                                    onPress={getCurrentLocation}
                                    style={styles.locationButton}
                                    disabled={submitLoading || locLoading}
                                    loading={locLoading}
                                >
                                    위치
                                </Button>
                            </View>

                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                disabled={submitLoading}
                                loading={submitLoading}
                                style={styles.button}
                                icon={'check'}
                            >
                                수정
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
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
    },
    inputFlex: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    datePicker: {
        flex: 1,
        marginRight: 8,
    },
    timePicker: {
        flex: 1,
        marginLeft: 8,
    },
    dateTimeInput: {
    },
    locationButton: {
        marginLeft: 8,
        height: 48,
        justifyContent: 'center',
    },
    button: {
        width: '100%',
        marginTop: 20,
        paddingVertical: 6,
        borderRadius: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditCourse;

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Coordinate } from '@/interfaces/course';
import { getCurrentPositionAsync, useForegroundPermissions } from 'expo-location';
import Toast from 'react-native-toast-message';
import { createCourse } from '@/scripts/api/course';
import eventEmitter from '@/scripts/utils/eventEmitter';

const CreateCourse = () => {
    const [title, setTitle] = useState('');
    const [startAt, setStartAt] = useState<Date>(new Date());
    const [endAt, setEndAt] = useState<Date>(new Date(Date.now() + 3600000));
    const [location, setLocation] = useState<Coordinate>();
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);
    const [locPermission, requestLocPermission] = useForegroundPermissions();
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);

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

    const handleSubmit = async () => {
        if (loading) {
            return;
        }
        if (!location) {
            Toast.show({
                type: 'error',
                text1: '생성 실패',
                text2: '위치값이 유효하지 않습니다.',
            });
            return;
        }
        if (!title) {
            Toast.show({
                type: 'error',
                text1: '생성 실패',
                text2: '수업 이름을 입력해주세요.',
            });
            return;
        }
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const result = await createCourse({ title, startAt, endAt, location });
            if (result == 'success') {
                Toast.show({
                    type: 'success',
                    text1: '생성 성공',
                    text2: '수업이 생성되었습니다.',
                });
                eventEmitter.emit('refresh_course');
                return router.back();
            } else {
                throw new Error(result);
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: '생성 실패',
                text2: error.toString(),
            });
            console.error(error);
        }

        setLoading(false);
    };

    const getCurrentLocation = async () => {
        setLocLoading(true);
        const { granted } = await requestLocPermission();
        if (!granted) {
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
            <Card mode="contained" style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Text style={styles.title}>수업 생성하기</Text>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            label="수업 이름"
                            value={title}
                            onChangeText={setTitle}
                            disabled={loading}
                        />
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity
                            onPress={() => setShowStartDate(true)}
                            style={styles.datePicker}
                            disabled={loading}
                        >
                            <TextInput
                                label="시작 날짜"
                                value={startAt.toLocaleDateString()}
                                editable={false}
                                style={styles.dateTimeInput}
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
                            disabled={loading}
                        >
                            <TextInput
                                label="시작 시간"
                                value={startAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                editable={false}
                                style={styles.dateTimeInput}
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
                            disabled={loading}
                        >
                            <TextInput
                                label="종료 날짜"
                                value={endAt.toLocaleDateString()}
                                editable={false}
                                style={styles.dateTimeInput}
                            />
                        </TouchableOpacity>
                        {showEndDate && (
                            <DateTimePicker
                                value={endAt}
                                mode="date"
                                display="default"
                                onChange={handleEndDateChange}
                            />
                        )}
                        <TouchableOpacity
                            onPress={() => setShowEndTime(true)}
                            style={styles.timePicker}
                            disabled={loading}
                        >
                            <TextInput
                                label="종료 시간"
                                value={endAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                editable={false}
                                style={styles.dateTimeInput}
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
                            style={styles.input}
                            label="위치"
                            value={`${location?.lat}, ${location?.lon}`}
                            editable={false}
                        />
                        <Button
                            mode="contained"
                            icon="crosshairs-gps"
                            onPress={getCurrentLocation}
                            style={styles.locationButton}
                            disabled={loading || locLoading}
                            loading={locLoading}
                            labelStyle={{ lineHeight: 18 }}
                        >
                            위치
                        </Button>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        disabled={loading}
                        loading={loading}
                        style={styles.button}
                        icon={'plus'}
                        labelStyle={{ lineHeight: 18 }}
                    >
                        생성
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
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
    card: {
        width: '100%',
        paddingVertical: 8,
    },
    cardContent: {
        alignItems: 'center',
    },
});

export default CreateCourse;

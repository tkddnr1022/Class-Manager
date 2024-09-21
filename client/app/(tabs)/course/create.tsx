import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button, Text, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Coordinate } from '@/interfaces/course';
import { getCurrentPositionAsync, useForegroundPermissions } from 'expo-location';

const CreateCourse = () => {
    const [title, setTitle] = useState('');
    const [startAt, setStartAt] = useState<Date>(new Date());
    const [endAt, setEndAt] = useState<Date>(new Date(Date.now() + 3600000));
    const [location, setLocation] = useState<Coordinate>();
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);
    const [locPermission, requestLocPermission] = useForegroundPermissions(); // 위치 권한

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

    const handleSubmit = () => {
        console.log({
            title,
            startAt,
            endAt,
            location,
        });
        router.replace(`(tabs)/course`);
    };

    const getCurrentLocation = async () => {
        if (!locPermission?.granted) {
            return;
        }
        const { latitude, longitude } = (await getCurrentPositionAsync()).coords;
        setLocation({ lat: latitude, lon: longitude });
    };

    useEffect(() => {
        requestLocPermission().then(() => {
            getCurrentLocation();
        });
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>수업 개설하기</Text>
            <View style={styles.row}>
                <TextInput
                    style={{ flex: 1 }}
                    label="수업 이름"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => setShowStartDate(true)} style={styles.datePicker}>
                    <TextInput
                        label="시작 날짜"
                        value={startAt.toLocaleDateString()}
                        editable={false}
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
                <TouchableOpacity onPress={() => setShowStartTime(true)} style={styles.timePicker}>
                    <TextInput
                        label="시작 시간"
                        value={startAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        editable={false}
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
                <TouchableOpacity onPress={() => setShowEndDate(true)} style={styles.datePicker}>
                    <TextInput
                        label="종료 날짜"
                        value={endAt.toLocaleDateString()}
                        editable={false}
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
                <TouchableOpacity onPress={() => setShowEndTime(true)} style={styles.timePicker}>
                    <TextInput
                        label="종료 시간"
                        value={endAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        editable={false}
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
                <Button mode="contained-tonal" icon="crosshairs-gps" onPress={getCurrentLocation} style={styles.locationButton}>위치</Button>
            </View>

            <Button mode="contained-tonal" onPress={handleSubmit}>개설</Button>
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
    datePicker: {
        flex: 1,
        marginRight: 4,
    },
    timePicker: {
        flex: 1,
        marginLeft: 4,
    },
    locationButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});

export default CreateCourse;

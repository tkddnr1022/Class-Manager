import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Course from '@/interfaces/course';
import { Button, Text, Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // MaterialIcons import
import Toast from 'react-native-toast-message';

interface Student {
    name: string;
    studentId: string;
    deviceId: string;
    attendanceTime: Date;
}

const CourseDetails = () => {
    const { id } = useLocalSearchParams();
    const courseId = id as string;
    const [course, setCourse] = useState<Course>();
    const [students, setStudents] = useState<Student[]>([]);
    const router = useRouter();

    useEffect(() => {
        // TODO: Fetch the course details and student list based on the id
        setCourse({
            courseId: "1",
            title: 'Math 101',
            startAt: new Date('2023-09-20T09:00:00'),
            endAt: new Date('2023-09-20T10:00:00'),
            location: { lat: 37.7749, lon: -122.4194 }
        });
        setStudents([
            { name: '홍길동', studentId: 'S001', deviceId: 'DEVICE001', attendanceTime: new Date('2023-09-20T09:05:00') },
            { name: '김철수', studentId: 'S002', deviceId: 'DEVICE002', attendanceTime: new Date('2023-09-20T09:10:05') },
            { name: '김철수', studentId: 'S002', deviceId: 'DEVICE002', attendanceTime: new Date('2023-09-20T09:10:10') },
            { name: '김철수', studentId: 'S002', deviceId: 'DEVICE002', attendanceTime: new Date('2023-09-20T09:10:15') },
            { name: '김철수', studentId: 'S002', deviceId: 'DEVICE002', attendanceTime: new Date('2023-09-20T09:10:18') },
            { name: '김철수', studentId: 'S002', deviceId: 'DEVICE002', attendanceTime: new Date('2023-09-20T09:10:23') },
            { name: '김철수', studentId: 'S002', deviceId: 'DEVICE002', attendanceTime: new Date('2023-09-20T09:10:45') },
        ]);
    }, [id]);

    const handleEdit = () => {
        router.push(`(tabs)/course/edit/${id}`);
    };

    const handleDelete = () => {
        // TODO: API call to delete the course
        Toast.show({
            type: 'success',
            text1: '삭제 성공',
            text2: '강의가 삭제되었습니다.'
        });
        router.back();
    };

    const renderStudentItem = ({ item }: { item: Student }) => (
        <Card style={styles.studentCard}>
            <Card.Content>
                <Text style={styles.studentName}>{item.name}{` (${item.studentId})`}</Text>
                <Text>출석 시간: {item.attendanceTime.toLocaleString('ko-KR')}</Text>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            {course ? (
                <>
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.row}>
                                <Text style={styles.title}>{course.title}</Text>
                            </View>
                            <View style={styles.row}>
                                <MaterialIcons name="access-time" size={20} color="black" />
                                <Text style={styles.detail}>시작 시간: {course.startAt.toLocaleString('ko-KR')}</Text>
                            </View>
                            <View style={styles.row}>
                                <MaterialIcons name="access-time" size={20} color="black" />
                                <Text style={styles.detail}>종료 시간: {course.endAt.toLocaleString('ko-KR')}</Text>
                            </View>
                            <View style={styles.row}>
                                <MaterialIcons name="location-on" size={20} color="black" />
                                <Text style={styles.detail}>위치: 위도 {course.location.lat}, 경도 {course.location.lon}</Text>
                            </View>
                        </Card.Content>
                        <Card.Actions>
                            <Button mode="contained-tonal" onPress={handleEdit} icon="pencil">
                                수정
                            </Button>
                            <Button mode="contained-tonal" onPress={handleDelete} icon="delete">
                                삭제
                            </Button>
                            <Button mode="contained-tonal" onPress={() => router.push(`(tabs)/course/qrcode/${id}`)} icon="qrcode-scan">
                                QR코드
                            </Button>
                        </Card.Actions>
                    </Card>
                    <Text style={styles.studentListTitle}>출석 학생 목록</Text>
                    <FlatList
                        data={students}
                        renderItem={renderStudentItem}
                        keyExtractor={(item) => item.attendanceTime.toISOString()}
                        style={styles.studentList}
                        contentContainerStyle={styles.studentListContainer}
                    />
                </>
            ) : (
                <Text>로딩 중...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        borderRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    detail: {
        fontSize: 16,
        marginVertical: 4,
        marginLeft: 4,
    },
    studentListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 16,
    },
    studentList: {
        marginTop: 16,
    },
    studentListContainer: {
        paddingBottom: 16,
    },
    studentCard: {
        marginBottom: 12,
        borderRadius: 8,
        elevation: 2,
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default CourseDetails;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, FAB, Card } from 'react-native-paper';
import Course from '@/interfaces/course';

const { width, height } = Dimensions.get('window');

const CourseList = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const router = useRouter();

    useEffect(() => {
        // TODO: Replace with API call to fetch the courses
        const courses: Course[] = [
            { courseId: "1", title: 'Math 101', startAt: new Date('2023-09-20T09:00:00'), endAt: new Date('2023-09-20T10:00:00'), location: { lat: 37.7749, lon: -122.4194 } },
            { courseId: "2", title: 'Physics 202', startAt: new Date('2023-09-19T14:00:00'), endAt: new Date('2023-09-19T15:00:00'), location: { lat: 37.7749, lon: -122.4194 } },
        ];

        setCourses(courses);
    }, []);

    const goToDetails = (courseId: string) => {
        router.push(`(tabs)/course/${courseId}`);
    };

    const goToCreateCourse = () => {
        router.push(`(tabs)/course/create`);
    };

    const renderItem = ({ item }: { item: Course }) => (
        <Card style={styles.courseCard}>
            <Card.Content>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseTime}>
                    시작: {item.startAt.toLocaleString('ko-KR')}{"\n"}
                    종료: {item.endAt.toLocaleString('ko-KR')}
                </Text>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => goToDetails(item.courseId)}>상세 보기</Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>내 수업 목록</Text>
            <FlatList
                data={courses}
                renderItem={renderItem}
                keyExtractor={(item) => item.courseId}
                contentContainerStyle={styles.courseList}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={goToCreateCourse}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    courseList: {
        paddingBottom: 80, // FAB 위치를 위해 아래 패딩 추가
    },
    courseCard: {
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    courseTime: {
        fontSize: 14,
        color: 'gray',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

export default CourseList;

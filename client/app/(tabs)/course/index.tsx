import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, FAB, Card, Divider } from 'react-native-paper';
import Course from '@/interfaces/course';

const CourseList = () => {
    const [upcomingCourses, setUpcomingCourses] = useState<Course[]>([]);
    const [completedCourses, setCompletedCourses] = useState<{ date: string; courses: Course[] }[]>([]);
    const router = useRouter();

    useEffect(() => {
        // TODO: Replace with API call to fetch the courses
        const courses: Course[] = [
            { courseId: "1", title: 'Math 101', startAt: new Date('2023-09-20T09:00:00'), endAt: new Date('2023-09-20T10:00:00'), location: { lat: 37.7749, lon: -122.4194 } },
            { courseId: "2", title: 'Physics 202', startAt: new Date('2023-09-19T14:00:00'), endAt: new Date('2023-09-19T15:00:00'), location: { lat: 37.7749, lon: -122.4194 } },
            { courseId: "3", title: 'Biology 303', startAt: new Date('2024-10-10T10:00:00'), endAt: new Date('2024-10-10T12:00:00'), location: { lat: 37.7749, lon: -122.4194 } },
            { courseId: "2", title: 'Physics 202', startAt: new Date('2023-09-19T14:00:00'), endAt: new Date('2023-09-19T15:00:00'), location: { lat: 37.7749, lon: -122.4194 } },
            { courseId: "2", title: 'Physics 202', startAt: new Date('2023-09-19T14:00:00'), endAt: new Date('2023-09-19T15:00:00'), location: { lat: 37.7749, lon: -122.4194 } },
            { courseId: "2", title: 'Physics 202', startAt: new Date('2023-09-19T14:00:00'), endAt: new Date('2023-09-19T15:00:00'), location: { lat: 37.7749, lon: -122.4194 } },
        ];

        const now = new Date();

        // 현재 시간 이후의 수업은 진행 예정, 그 외는 종료된 수업
        const upcoming = courses.filter(course => course.endAt > now);
        const completed = courses.filter(course => course.endAt <= now);

        // 종료된 수업을 날짜별로 그룹화
        const groupedCompletedCourses = completed.reduce((groups: { [key: string]: Course[] }, course) => {
            const date = course.endAt.toLocaleDateString('ko-KR'); // 날짜만 추출
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(course);
            return groups;
        }, {});

        // 그룹화된 수업 데이터를 배열로 변환하고 날짜 최신순으로 정렬
        const completedCoursesArray = Object.keys(groupedCompletedCourses)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map(date => ({
                date,
                courses: groupedCompletedCourses[date],
            }));

        setUpcomingCourses(upcoming);
        setCompletedCourses(completedCoursesArray);
    }, []);

    const goToDetails = (courseId: string) => {
        router.push(`/(tabs)/course/${courseId}`);
    };

    const goToCreateCourse = () => {
        router.push('/(tabs)/course/create');
    };

    const renderUpcomingItem = ({ item }: { item: Course }) => (
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

    const renderCompletedItem = (courses: Course[]) => (
        <View>
            {courses.map(item => (
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
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.title}>내 수업 목록</Text>

                {upcomingCourses.length > 0 ? (
                    upcomingCourses.map(item => renderUpcomingItem({ item }))
                ) : (
                    <Text>진행 예정인 수업이 없습니다.</Text>
                )}

                <Divider bold={true} style={styles.divider} />

                <Text style={styles.sectionTitle}>종료된 수업</Text>
                {completedCourses.length > 0 ? (
                    completedCourses.map(({ date, courses }) => (
                        <View key={date}>
                            <Text style={styles.completedSectionTitle}>{date}</Text>
                            {renderCompletedItem(courses)}
                        </View>
                    ))
                ) : (
                    <Text>종료된 수업이 없습니다.</Text>
                )}

                <Divider bold={true} style={styles.divider} />
            </ScrollView>
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
        flex: 1,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    scrollContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        marginVertical: 8,
        fontWeight: 'bold',
    },
    completedSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        marginTop: 16,
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
    divider: {
        marginVertical: 16,
    },
});

export default CourseList;

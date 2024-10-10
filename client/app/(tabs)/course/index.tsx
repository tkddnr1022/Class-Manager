import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, FAB, Card, Divider, ActivityIndicator } from 'react-native-paper';
import Course from '@/interfaces/course';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCourseByUserId } from '@/scripts/api/course';
import eventEmitter from '@/scripts/utils/eventEmitter';

const CourseList = () => {
    const [upcomingCourses, setUpcomingCourses] = useState<Course[]>([]);
    const [completedCourses, setCompletedCourses] = useState<{ date: string; courses: Course[] }[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        eventEmitter.on('refresh_course', fetchCourse);
        fetchCourse();

        return () => {
            eventEmitter.off('refresh_course', fetchCourse);
        }
    }, []);

    const fetchCourse = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const userId = await AsyncStorage.getItem('userId');
            const courses = await getCourseByUserId(userId as string);
            if (!courses || !courses.length) {
                setLoading(false);
                return;
            }

            const now = new Date();

            // 과거, 현재 이후로 나누기
            const upcoming = courses
                .filter(course => new Date(course.endAt) > now)
                .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

            const completed = courses
                .filter(course => new Date(course.endAt) <= now)
                .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

            // 완료된 수업을 날짜별로 그룹화
            const completedGrouped = completed.reduce<{ [key: string]: Course[] }>((acc, course) => {
                const endDate = new Date(course.endAt).toDateString();
                if (!acc[endDate]) {
                    acc[endDate] = [];
                }
                acc[endDate].push(course);
                return acc;
            }, {});

            // 날짜별로 그룹화된 데이터를 최신순으로 정렬
            const completedList = Object.keys(completedGrouped)
                // 날짜 정렬
                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                .map(date => ({
                    date,
                    courses: completedGrouped[date]
                }));

            setUpcomingCourses(upcoming);
            setCompletedCourses(completedList);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const goToDetails = (courseId: string) => {
        router.push(`/(tabs)/course/${courseId}`);
    };

    const goToCreateCourse = () => {
        router.push('/(tabs)/course/create');
    };

    const renderUpcomingItem = ({ item }: { item: Course }) => (
        <Card style={styles.courseCard} key={item._id}>
            <Card.Content>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseTime}>
                    시작: {new Date(item.startAt).toLocaleString('ko-KR')}{"\n"}
                    종료: {new Date(item.endAt).toLocaleString('ko-KR')}
                </Text>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => { goToDetails(item._id) }}>상세 보기</Button>
            </Card.Actions>
        </Card>
    );

    const renderCompletedItem = (courses: Course[]) => (
        <View>
            {courses.map(item => (
                <Card style={styles.courseCard} key={item._id}>
                    <Card.Content>
                        <Text style={styles.courseTitle}>{item.title}</Text>
                        <Text style={styles.courseTime}>
                            시작: {new Date(item.startAt).toLocaleString('ko-KR')}{"\n"}
                            종료: {new Date(item.endAt).toLocaleString('ko-KR')}
                        </Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={() => goToDetails(item._id)}>상세 보기</Button>
                    </Card.Actions>
                </Card>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} size={'large'} />
                    <Text>불러오는 중..</Text>
                </View>
            ) : (
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
                                <Text style={styles.completedSectionTitle}>{new Date(date).toLocaleDateString('ko-KR')}</Text>
                                {renderCompletedItem(courses)}
                            </View>
                        ))
                    ) : (
                        <Text>종료된 수업이 없습니다.</Text>
                    )}
                    <Divider bold={true} style={styles.divider} />
                </ScrollView>
            )}
            <FAB
                style={styles.fabPlus}
                icon="plus"
                onPress={goToCreateCourse}
                disabled={loading}
            />
            <FAB
                style={styles.fabRefresh}
                icon="refresh"
                onPress={fetchCourse}
                disabled={loading}
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
    fabPlus: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
    fabRefresh: {
        position: 'absolute',
        right: 16,
        bottom: 86,
    },
    divider: {
        marginVertical: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
});

export default CourseList;

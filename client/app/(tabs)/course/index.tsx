import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, FAB, Card, Divider, ActivityIndicator } from 'react-native-paper';
import Course from '@/interfaces/course';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCourseByUserId } from '@/scripts/api/course';
import eventEmitter from '@/scripts/utils/eventEmitter';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const CourseList = () => {
    const [upcomingCourses, setUpcomingCourses] = useState<Course[]>([]);
    const [completedCourses, setCompletedCourses] = useState<{ date: string; courses: Course[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        eventEmitter.on('refresh_course', fetchCourse);
        fetchCourse();

        return () => {
            eventEmitter.off('refresh_course', fetchCourse);
        };
    }, []);

    const fetchCourse = async () => {
        setUpcomingCourses([]);
        setCompletedCourses([]);
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId');
            const courses = await getCourseByUserId(userId as string);
            if (!courses || !courses.length) {
                setLoading(false);
                return;
            }

            const now = new Date();
            const upcoming = courses.filter(course => new Date(course.endAt) > now)
                .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

            const completed = courses.filter(course => new Date(course.endAt) <= now)
                .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

            const completedGrouped = completed.reduce<{ [key: string]: Course[] }>((acc, course) => {
                const endDate = new Date(course.endAt).toDateString();
                if (!acc[endDate]) {
                    acc[endDate] = [];
                }
                acc[endDate].push(course);
                return acc;
            }, {});

            const completedList = Object.keys(completedGrouped)
                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                .map(date => ({ date, courses: completedGrouped[date] }));

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
            <TouchableOpacity
                style={styles.goIcon}
                onPress={() => goToDetails(item._id)}
            >
                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
            </TouchableOpacity>
            <Card.Content>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseTime}>
                    시작: {new Date(item.startAt).toLocaleString('ko-KR')}{"\n"}
                    종료: {new Date(item.endAt).toLocaleString('ko-KR')}
                </Text>
            </Card.Content>
        </Card>
    );

    const renderCompletedItem = (courses: Course[]) => (
        <View>
            {courses.map(item => (
                <Card style={styles.courseCard} key={item._id}>
                    <TouchableOpacity
                        style={styles.goIcon}
                        onPress={() => goToDetails(item._id)}
                    >
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                    </TouchableOpacity>
                    <Card.Content>
                        <Text style={styles.courseTitle}>{item.title}</Text>
                        <Text style={styles.courseTime}>
                            시작: {new Date(item.startAt).toLocaleString('ko-KR')}{"\n"}
                            종료: {new Date(item.endAt).toLocaleString('ko-KR')}
                        </Text>
                    </Card.Content>
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
                <ScrollView>
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
                        <Text style={styles.noCourseText}>종료된 수업이 없습니다.</Text>
                    )}
                    <Divider bold={true} style={styles.divider} />
                </ScrollView>
            )}
            <FAB
                style={styles.fabPlus}
                icon="plus"
                onPress={goToCreateCourse}
                disabled={loading}
                color='white'
            />
            <FAB
                style={styles.fabRefresh}
                icon="refresh"
                onPress={fetchCourse}
                disabled={loading}
                color='white'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginVertical: 16,
        marginHorizontal: 4,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 20,
        marginVertical: 8,
        marginHorizontal: 4,
        fontWeight: 'bold',
        color: '#333',
    },
    completedSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        marginTop: 8,
        marginLeft: 8,
        color: '#333',
    },
    courseCard: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 3,
        backgroundColor: '#fff',
        paddingTop: 12,
        marginHorizontal: 4,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    courseTime: {
        fontSize: 14,
        color: '#4f4f4f',
    },
    fabPlus: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: Colors.light.tint,
    },
    fabRefresh: {
        position: 'absolute',
        right: 16,
        bottom: 86,
        backgroundColor: Colors.light.tint,
    },
    divider: {
        marginVertical: 16,
        marginHorizontal: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCourseText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
    },
    goIcon: {
        position: 'absolute',
        top: 4,
        right: 8,
        zIndex: 1,
    }
});

export default CourseList;

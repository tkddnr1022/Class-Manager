import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, FAB, Card, Divider, ActivityIndicator, useTheme } from 'react-native-paper';
import Course from '@/interfaces/course';
import { getCourseByUserId } from '@/scripts/api/course';
import eventEmitter from '@/scripts/utils/eventEmitter';
import { MaterialIcons } from '@expo/vector-icons';
import { getStorageProfile } from '@/scripts/utils/storage';

const CourseList = () => {
    const [upcomingCourses, setUpcomingCourses] = useState<Course[]>([]);
    const [completedCourses, setCompletedCourses] = useState<{ date: string; courses: Course[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
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
            const profile = await getStorageProfile();
            if (!profile) {
                return;
            }
            const userId = profile._id;
            const courses = await getCourseByUserId(userId);
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
        <Card mode="contained" style={styles.courseCard} key={item._id}>
            <TouchableOpacity
                style={styles.goIcon}
                onPress={() => goToDetails(item._id)}
            >
                <MaterialIcons name="keyboard-arrow-right" size={24} color={colors.secondary} />
            </TouchableOpacity>
            <Card.Content>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={[styles.courseTime, { color: colors.secondary }]}>
                    시작: {new Date(item.startAt).toLocaleString('ko-KR')}{"\n"}
                    종료: {new Date(item.endAt).toLocaleString('ko-KR')}
                </Text>
            </Card.Content>
        </Card>
    );

    const renderCompletedItem = (courses: Course[]) => (
        <View>
            {courses.map(item => (
                <Card mode="contained" style={styles.courseCard} key={item._id}>
                    <TouchableOpacity
                        style={styles.goIcon}
                        onPress={() => goToDetails(item._id)}
                    >
                        <MaterialIcons name="keyboard-arrow-right" size={24} color={colors.secondary} />
                    </TouchableOpacity>
                    <Card.Content>
                        <Text style={styles.courseTitle}>{item.title}</Text>
                        <Text style={[styles.courseTime, { color: colors.secondary }]}>
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
                        <Text style={[styles.noCourseText, { color: colors.secondary }]}>종료된 수업이 없습니다.</Text>
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
        padding: 18,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        marginHorizontal: 4,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        marginVertical: 8,
        marginHorizontal: 4,
        fontWeight: 'bold',
    },
    completedSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        marginTop: 8,
        marginLeft: 8,
    },
    courseCard: {
        marginBottom: 16,
        paddingTop: 12,
        marginHorizontal: 4,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    courseTime: {
        fontSize: 14,
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
        marginHorizontal: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCourseText: {
        fontSize: 16,
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

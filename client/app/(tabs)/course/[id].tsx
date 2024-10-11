import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Course from '@/interfaces/course';
import { Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // MaterialIcons import
import Toast from 'react-native-toast-message';
import { deleteCourse, getCourse } from '@/scripts/api/course';
import { getEntryByCourseId } from '@/scripts/api/entry';
import Entry from '@/interfaces/entry';
import eventEmitter from '@/scripts/utils/eventEmitter';

const CourseDetails = () => {
    const { id } = useLocalSearchParams();
    const [course, setCourse] = useState<Course>();
    const [entries, setEntries] = useState<Entry[]>();
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        eventEmitter.on('refresh_courseDetail', fetchCourse);
        fetchCourse();

        return () => {
            eventEmitter.off('refresh_courseDetail', fetchCourse);
        }
    }, [id]);

    const fetchCourse = async () => {
        setLoading(true);
        if (!id) {
            setLoading(false);
            return;
        }
        const courseId = id as string;
        const course = await getCourse(courseId);
        const entries = await getEntryByCourseId(courseId);
        setCourse(course);
        setEntries(entries);
        setLoading(false);
    }

    const handleEdit = () => {
        router.push(`/(tabs)/course/edit/${id}`);
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
        const courseId = id as string;
        const result = await deleteCourse(courseId);
        if (result == "success") {
            Toast.show({
                type: 'success',
                text1: '삭제 성공',
                text2: '강의가 삭제되었습니다.'
            });
            setDeleteLoading(false);
            eventEmitter.emit('refresh_course');
            return router.back();
        }
        else {
            Toast.show({
                type: 'error',
                text1: '삭제 실패',
                text2: result.toString()
            });
            setDeleteLoading(false);
        }
    };

    const renderStudentItem = ({ item }: { item: Entry }) => (
        <Card style={styles.entryCard}>
            <Card.Content>
                <Text style={styles.entryUsername}>{item.userId.username}{` (${item.userId.studentId})`}</Text>
                <Text>출석 시간: {new Date(item.entryTime).toLocaleString('ko-KR')}</Text>
            </Card.Content>
        </Card>
    );

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
                            <Card.Content>
                                <View style={styles.row}>
                                    <Text style={styles.title}>{course.title}</Text>
                                </View>
                                <View style={styles.row}>
                                    <MaterialIcons name="access-time" size={20} color="black" />
                                    <Text style={styles.detail}>시작 시간: {new Date(course.startAt).toLocaleString('ko-KR')}</Text>
                                </View>
                                <View style={styles.row}>
                                    <MaterialIcons name="access-time" size={20} color="black" />
                                    <Text style={styles.detail}>종료 시간: {new Date(course.endAt).toLocaleString('ko-KR')}</Text>
                                </View>
                                <View style={styles.row}>
                                    <MaterialIcons name="location-on" size={20} color="black" />
                                    <Text style={styles.detail}>위치: {course.location.lat}, {course.location.lon}</Text>
                                </View>
                            </Card.Content>
                            <Card.Actions>
                                <Button mode="contained-tonal" onPress={handleEdit} icon="pencil">
                                    수정
                                </Button>
                                <Button
                                    mode="contained-tonal"
                                    onPress={handleDelete}
                                    icon="delete"
                                    loading={deleteLoading}
                                    disabled={deleteLoading}
                                >
                                    삭제
                                </Button>
                                <Button mode="contained-tonal" onPress={() => router.push(`/(tabs)/course/qrcode/${id}`)} icon="qrcode-scan">
                                    QR코드
                                </Button>
                            </Card.Actions>
                        </Card>
                        <Text style={styles.entryListTitle}>출석 학생 목록</Text>
                        {entries && entries.length ? (
                            <FlatList
                                data={entries}
                                renderItem={renderStudentItem}
                                keyExtractor={(item) => item.userId.studentId}
                                style={styles.entryList}
                                contentContainerStyle={styles.entryListContainer}
                            />
                        ) : (
                            <Text>출석한 학생이 없습니다.</Text>
                        )}
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
    entryListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 16,
    },
    entryList: {
        marginTop: 16,
    },
    entryListContainer: {
        paddingBottom: 16,
    },
    entryCard: {
        marginBottom: 12,
        borderRadius: 8,
        elevation: 2,
    },
    entryUsername: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
});

export default CourseDetails;

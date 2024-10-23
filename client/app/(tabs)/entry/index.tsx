import Entry from '@/interfaces/entry';
import { getEntryByUserId } from '@/scripts/api/entry';
import eventEmitter from '@/scripts/utils/eventEmitter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { Text, Card, ActivityIndicator, FAB, useTheme } from 'react-native-paper';

const EntryRecord = () => {
    const [groupedEntries, setGroupedEntries] = useState<{ title: string; data: Entry[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

    useEffect(() => {
        eventEmitter.on('refresh_entry', fetchEntry);
        fetchEntry();

        return () => {
            eventEmitter.off('refresh_entry', fetchEntry);
        }
    }, []);

    const renderEntryItem = ({ item }: { item: Entry }) => (
        <Card mode="contained" style={styles.entryCard}>
            <Card.Content>
                <Text style={styles.entryTitle}>{item.courseId ? item.courseId.title : "삭제된 수업"}</Text>
                <Text style={{ color: colors.secondary }}>출석 시간: {new Date(item.entryTime).toLocaleString('ko-KR')}</Text>
            </Card.Content>
        </Card>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <Text style={styles.sectionHeader}>{new Date(title).toLocaleDateString('ko-KR')}</Text>
    );

    const fetchEntry = async () => {
        setGroupedEntries([]);
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId');
            const entries = await getEntryByUserId(userId as string);
            if (!entries || !entries.length) {
                setLoading(false);
                return;
            }

            // 날짜별로 출석 기록을 그룹화
            const grouped = entries.reduce((groups: { [key: string]: Entry[] }, entry) => {
                const date = new Date(entry.entryTime).toDateString();
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(entry);
                return groups;
            }, {});

            // 날짜별로 그룹화된 데이터를 최신순으로 정렬
            const groupedData = Object.keys(grouped)
                // 날짜 정렬
                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                .map(date => ({
                    title: date,
                    // 출석 시간 정렬
                    data: grouped[date].sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()),
                }));

            setGroupedEntries(groupedData);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    const goToCamera = () => {
        return router.push('/camera');
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} size={'large'} />
                    <Text>불러오는 중..</Text>
                </View>
            ) : (groupedEntries.length > 0 ? (
                <>
                    <Text style={styles.title}>내 출석 기록</Text>
                    <SectionList
                        sections={groupedEntries}
                        renderItem={renderEntryItem}
                        renderSectionHeader={renderSectionHeader}
                        keyExtractor={(item) => new Date(item.entryTime).toISOString()}
                        contentContainerStyle={styles.entryListContainer}
                    />
                </>) : (<Text style={styles.noEntryText}>출석 기록이 없습니다.</Text>)
            )}
            <FAB
                style={styles.fabPlus}
                icon="plus"
                onPress={goToCamera}
                disabled={loading}
                color='white'
            />
            <FAB
                style={styles.fabRefresh}
                icon="refresh"
                onPress={fetchEntry}
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
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 4,
        marginBottom: 8,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    entryListContainer: {
        paddingBottom: 8,
    },
    entryCard: {
        marginBottom: 12,
        marginHorizontal: 4,
        padding: 2,
    },
    entryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    noEntryText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
    }
});

export default EntryRecord;

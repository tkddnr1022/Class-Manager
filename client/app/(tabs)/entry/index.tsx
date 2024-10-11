import Entry from '@/interfaces/entry';
import { getEntryByUserId } from '@/scripts/api/entry';
import eventEmitter from '@/scripts/utils/eventEmitter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { Text, Card, ActivityIndicator, FAB } from 'react-native-paper';

const EntryRecord = () => {
    const [groupedEntries, setGroupedEntries] = useState<{ title: string; data: Entry[] }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        eventEmitter.on('refresh_entry', fetchEntry);
        fetchEntry();

        return () => {
            eventEmitter.off('refresh_entry', fetchEntry);
        }
    }, []);

    const renderEntryItem = ({ item }: { item: Entry }) => (
        <Card style={styles.entryCard}>
            <Card.Content>
                <Text style={styles.entryTitle}>{item.courseId ? item.courseId.title : "삭제된 수업"}</Text>
                <Text>출석 시간: {new Date(item.entryTime).toLocaleString('ko-KR')}</Text>
            </Card.Content>
        </Card>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <Text style={styles.sectionHeader}>{new Date(title).toLocaleDateString('ko-KR')}</Text>
    );

    const fetchEntry = async () => {
        setGroupedEntries([]);
        setLoading(true);
        // for dev
        await new Promise(resolve => setTimeout(resolve, 2000));
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
                        style={styles.entryList}
                        contentContainerStyle={styles.entryListContainer}
                    />
                </>) : (<Text>출석 기록이 없습니다.</Text>)
            )}
            <FAB
                style={styles.fab}
                icon="refresh"
                onPress={fetchEntry}
                disabled={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#f2f2f2',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginTop: 16,
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
    entryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

export default EntryRecord;

import Entry from '@/interfaces/entry';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { Text, Card } from 'react-native-paper';

const EntryRecord = () => {
    const [groupedEntries, setGroupedEntries] = useState<{ title: string; data: Entry[] }[]>([]);

    useEffect(() => {
        const entries: Entry[] = [
            { title: '웹서비스설계', attendanceTime: new Date('2023-09-25T09:05:00'), startAt: new Date('2023-09-25T09:00:00'), endAt: new Date('2023-09-25T09:50:00') },
            { title: '에너지저장공학', attendanceTime: new Date('2023-09-24T09:10:05'), startAt: new Date('2023-09-24T09:00:00'), endAt: new Date('2023-09-24T09:50:00') },
            { title: '데이터베이스', attendanceTime: new Date('2023-09-23T10:05:00'), startAt: new Date('2023-09-23T09:00:00'), endAt: new Date('2023-09-23T09:50:00') },
            { title: '프로그래밍', attendanceTime: new Date('2023-09-22T11:10:15'), startAt: new Date('2023-09-22T10:00:00'), endAt: new Date('2023-09-22T11:00:00') },
            { title: '네트워크', attendanceTime: new Date('2023-09-21T09:15:00'), startAt: new Date('2023-09-21T09:00:00'), endAt: new Date('2023-09-21T09:50:00') },
            { title: '자료구조', attendanceTime: new Date('2023-09-21T13:25:00'), startAt: new Date('2023-09-21T13:00:00'), endAt: new Date('2023-09-21T14:00:00') },
            { title: '컴파일러', attendanceTime: new Date('2023-09-20T08:55:00'), startAt: new Date('2023-09-20T08:00:00'), endAt: new Date('2023-09-20T08:50:00') },
            { title: '운영체제', attendanceTime: new Date('2023-09-20T14:30:00'), startAt: new Date('2023-09-20T14:00:00'), endAt: new Date('2023-09-20T14:50:00') },
            { title: '알고리즘', attendanceTime: new Date('2023-09-19T09:20:00'), startAt: new Date('2023-09-19T09:00:00'), endAt: new Date('2023-09-19T09:50:00') },
            { title: 'AI 개론', attendanceTime: new Date('2023-09-18T10:35:00'), startAt: new Date('2023-09-18T10:00:00'), endAt: new Date('2023-09-18T10:50:00') },
        ];

        // 날짜별로 출석 기록을 그룹화한 후 최신순으로 정렬
        const grouped = entries.reduce((groups: { [key: string]: Entry[] }, entry) => {
            const date = entry.attendanceTime.toLocaleDateString('ko-KR'); // 날짜만 추출
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(entry);
            return groups;
        }, {});

        // 날짜별로 그룹화된 데이터를 최신순으로 정렬
        const groupedData = Object.keys(grouped)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // 날짜를 최신순으로 정렬
            .map(date => ({
                title: date,
                data: grouped[date].sort((a, b) => b.attendanceTime.getTime() - a.attendanceTime.getTime()), // 날짜 내 출석 기록도 최신순으로 정렬
            }));

        setGroupedEntries(groupedData);
    }, []);

    const renderEntryItem = ({ item }: { item: Entry }) => (
        <Card style={styles.entryCard}>
            <Card.Content>
                <Text style={styles.entryTitle}>{item.title}</Text>
                <Text>출석 시간: {item.attendanceTime.toLocaleString('ko-KR')}</Text>
            </Card.Content>
        </Card>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    return (
        <View style={styles.container}>
            {groupedEntries.length > 0 ? (
                <>
                    <Text style={styles.title}>내 출석 기록</Text>
                    <SectionList
                        sections={groupedEntries}
                        renderItem={renderEntryItem}
                        renderSectionHeader={renderSectionHeader}
                        keyExtractor={(item) => item.attendanceTime.toISOString()}
                        style={styles.entryList}
                        contentContainerStyle={styles.entryListContainer}
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
});

export default EntryRecord;

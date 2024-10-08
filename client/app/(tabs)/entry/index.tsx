import Entry from '@/interfaces/entry';
import { getEntryByUserId } from '@/scripts/api/entry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { Text, Card } from 'react-native-paper';

const EntryRecord = () => {
    const [groupedEntries, setGroupedEntries] = useState<{ title: string; data: Entry[] }[]>([]);

    useEffect(() => {
        fetchEntry();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchEntry();
        }, [])
    );

    const renderEntryItem = ({ item }: { item: Entry }) => (
        <Card style={styles.entryCard}>
            <Card.Content>
                <Text style={styles.entryTitle}>{item.courseId.title}</Text>
                <Text>출석 시간: {new Date(item.entryTime).toLocaleString('ko-KR')}</Text>
            </Card.Content>
        </Card>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const fetchEntry = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const entries = await getEntryByUserId(userId as string);
            if (!entries) {
                return;
            }
            // 날짜별로 출석 기록을 그룹화한 후 최신순으로 정렬
            const grouped = entries.reduce((groups: { [key: string]: Entry[] }, entry) => {
                const date = new Date(entry.entryTime).toLocaleDateString('ko-KR'); // 날짜만 추출
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
                    data: grouped[date].sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime()), // 날짜 내 출석 기록도 최신순으로 정렬
                }));

            setGroupedEntries(groupedData);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            {groupedEntries.length > 0 ? (
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
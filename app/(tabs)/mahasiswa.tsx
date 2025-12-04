import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { SectionList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const DATA = [
    {
        title: 'Kelas A',
        data: ['Fildzah Hind', 'Garini Ulima', 'Regita Adinda'],
    },
    {
        title: 'Kelas B',
        data: ['Shelamita Amanah', 'Kaesti Novita', 'Rifda Najla'],
    },
    {
        title: 'Asisten Praktikum',
        data: ['M. Syaiful', 'Rini Husadiyah', 'Hayyu Rahmayani', 'Veronica Tia'],
    },
    {
        title: 'Dosen Pengampu Praktikum PGPBL',
        data: ['Raden Muhammad Anshori, S.Si., M.Sc.'],
    },
];

const App = () => (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
            <Text style={styles.mainTitle}>📚 Daftar Anggota dan Pengajar</Text>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>
                            <FontAwesome5 name="user-graduate" size={16} color="black" />
                            {'  '}
                            {item}
                        </Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>{title}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    </SafeAreaProvider>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#F3F4F6',
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 16,
        color: '#4B5563',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    headerContainer: {
        backgroundColor: '#c2c4c7ff',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginTop: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1F2937',
    },
    item: {
        backgroundColor: '#f3c8e0ff',
        padding: 16,
        marginVertical: 6,
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
    },
    title: {
        fontSize: 18,
        color: '#374151',
    },
});

export default App;

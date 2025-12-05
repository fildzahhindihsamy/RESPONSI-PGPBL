import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ref, onValue } from "firebase/database";
import { db } from '@/config/firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { FontAwesome5 } from '@expo/vector-icons';

// Komponen UI dengan style KAI Access
const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <FontAwesome5 name={icon} size={22} color="#FFFFFF" />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
    </View>
);

const ShortcutButton = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.shortcutButton} onPress={onPress}>
        <View style={styles.shortcutIconWrapper}>
            <FontAwesome5 name={icon} size={18} color="#F58220" />
        </View>
        <Text style={styles.shortcutText}>{title}</Text>
        <FontAwesome5 name="chevron-right" size={16} color="#005BAC" />
    </TouchableOpacity>
);

export default function HomeScreen() {
    const router = useRouter();
    const [stats, setStats] = useState({
        berfungsi: 0,
        tanpaPalang: 0,
        otomatis: 0,
        manual: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(() => {
        if (!refreshing) {
            setLoading(true);
        }
        const perlintasanRef = ref(db, 'perlintasan/');

        const unsubscribe = onValue(perlintasanRef, (snapshot) => {
            if (snapshot.exists()) {
                const allData = snapshot.val();
                
                let berfungsiCount = 0;
                let tanpaPalangCount = 0;
                let otomatisCount = 0;
                let manualCount = 0;

                Object.values(allData).forEach((item: any) => {
                    if (item.status === "Berfungsi") {
                        berfungsiCount++;
                    }
                    if (item.jenisPalang === "Tidak Ada Palang" || item.status === "Hilang") {
                        tanpaPalangCount++;
                    }
                    if (item.jenisPalang === "Otomatis") {
                        otomatisCount++;
                    }
                    if (item.jenisPalang === "Manual") {
                        manualCount++;
                    }
                });

                setStats({
                    berfungsi: berfungsiCount,
                    tanpaPalang: tanpaPalangCount,
                    otomatis: otomatisCount,
                    manual: manualCount,
                });

            } else {
                setStats({ berfungsi: 0, tanpaPalang: 0, otomatis: 0, manual: 0 });
            }
            setLoading(false);
            setRefreshing(false);
        }, (error) => {
            console.error("Error fetching stats from RTDB: ", error);
            setLoading(false);
            setRefreshing(false);
        });

        return unsubscribe;
    }, [refreshing]);

    useFocusEffect(
      useCallback(() => {
        const unsubscribe = fetchData();
        return () => unsubscribe();
      }, [fetchData])
    );

    const onRefresh = useCallback(() => {
      setRefreshing(true);
    }, []);

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh}
                    tintColor="#005BAC"
                    colors={["#005BAC"]}
                />
            }
        >
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <ThemedText style={styles.welcomeText}>Selamat Datang</ThemedText>
                </View>
                <ThemedText style={styles.title}>Dashboard Perlintasan</ThemedText>
                <ThemedText style={styles.subtitle}>Monitoring Data Perlintasan Kereta Api</ThemedText>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#005BAC" />
                    <Text style={styles.loadingText}>Memuat data...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.statsContainer}>
                        <StatCard 
                            title="Palang Berfungsi" 
                            value={stats.berfungsi} 
                            icon="check-circle" 
                            color="#28A745" 
                        />
                        <StatCard 
                            title="Tanpa Palang / Hilang" 
                            value={stats.tanpaPalang} 
                            icon="exclamation-triangle" 
                            color="#DC3545" 
                        />
                        <StatCard 
                            title="Palang Otomatis" 
                            value={stats.otomatis} 
                            icon="robot" 
                            color="#4DA6FF" 
                        />
                        <StatCard 
                            title="Palang Manual" 
                            value={stats.manual} 
                            icon="user-cog" 
                            color="#F58220" 
                        />
                    </View>

                    <View style={styles.shortcutsContainer}>
                        <View style={styles.sectionHeader}>
                            <FontAwesome5 name="bolt" size={18} color="#F58220" />
                            <ThemedText style={styles.sectionTitle}>Aksi Cepat</ThemedText>
                        </View>
                        <ShortcutButton 
                            title="Tambah Data Perlintasan" 
                            icon="plus-circle" 
                            onPress={() => router.push('/form')} 
                        />
                        <ShortcutButton 
                            title="Lihat Peta" 
                            icon="map-marked-alt" 
                            onPress={() => router.push('/(tabs)/maps')} 
                        />
                        <ShortcutButton 
                            title="Lihat Semua Data" 
                            icon="list-ul" 
                            onPress={() => router.push('/(tabs)/datalist')} 
                        />
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4F7',
    },
    header: {
        backgroundColor: '#005BAC',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
    },
    headerTop: {
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.85,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 15,
        color: '#FFFFFF',
        opacity: 0.9,
        lineHeight: 20,
    },
    loadingContainer: {
        marginTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6C757D',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 20,
        marginTop: -15,
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        borderLeftWidth: 3,
        borderLeftColor: '#F58220',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#005BAC',
        marginVertical: 6,
    },
    statTitle: {
        fontSize: 13,
        color: '#6C757D',
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '500',
    },
    shortcutsContainer: {
        padding: 20,
        paddingTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingLeft: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#005BAC',
        marginLeft: 10,
        letterSpacing: 0.3,
    },
    shortcutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#F58220',
    },
    shortcutIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF4EC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    shortcutText: {
        flex: 1,
        color: '#005BAC',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});
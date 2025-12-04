import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, SectionList, ActivityIndicator, RefreshControl, TouchableOpacity, Linking, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';

export default function LokasiScreen() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBOVT_iCy4XjqMgyVdxE5YNiHSDZJJmYh0",
        authDomain: "reacnative-6e58d.firebaseapp.com",
        databaseURL: "https://reacnative-6e58d-default-rtdb.firebaseio.com",
        projectId: "reacnative-6e58d",
        storageBucket: "reacnative-6e58d.firebasestorage.app",
        messagingSenderId: "571914017319",
        appId: "1:571914017319:web:28f1107088f147d8b94c02"
    };

    const handlePress = (coordinates) => {
        const [latitude, longitude] = coordinates.split(',').map(coord => coord.trim());
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    // Navigate to form edit screen
    const handleEdit = (item) => {
        router.push({
            pathname: "/formeditlocation",
            params: {
                id: item.id,
                name: item.name,
                coordinates: item.coordinates,
                accuration: item.accuration || ''
            }
        });
    };


    // if running on ios or android platform
    const handleDelete = (id) => {
        Alert.alert(
            "Hapus Lokasi",
            "Apakah Anda yakin ingin menghapus lokasi ini?",
            [
                {
                    text: "Batal",
                    style: "cancel"
                },
                {
                    text: "Hapus",
                    onPress: () => {
                        const pointRef = ref(db, `points/${id}`);
                        remove(pointRef);
                    },
                    style: "destructive"
                }
            ]
        );
    }

    useEffect(() => {
        const pointsRef = ref(db, 'points/');

        // Listen for data changes
        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Transform the Firebase object into an array
                const pointsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));


                // Format for SectionList
                const formattedData = [{
                    title: '📍 Lokasi Tersimpan',
                    data: pointsArray
                }];
                setSections(formattedData);
            } else {
                setSections([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase Error:", error);
            setLoading(false);
        });



        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Since Firebase provides real-time data, we can simulate a refresh
        // for UX purposes. A real data refetch isn't strictly necessary unless
        // you want to force a re-read from the server.
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);


    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }


    return (
        <View style={styles.container}>
            {sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handlePress(item.coordinates)}>
                            <View style={styles.item}>
                                <View style={styles.textContainer}>
                                    <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                                    <ThemedText>{item.coordinates}</ThemedText>
                                </View>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
                                        <FontAwesome5 name="pencil-alt" size={16} color="orange" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                                        <FontAwesome5 name="trash" size={16} color="red" />
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <ThemedText style={styles.header}>{title}</ThemedText>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <ThemedView style={styles.container}>
                    <ThemedText>Tidak ada data lokasi tersimpan.</ThemedText>
                </ThemedView>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF8FA',
        paddingTop: 22,
    },
    header: {
        fontSize: 23,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        marginHorizontal: 16,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#b9aeb4ff', // bayangan soft pink
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        letterSpacing: 0.5,

        // Gradasi soft pink ke abu lembut
        backgroundColor: '#F9A8D4', // fallback untuk Android
        background: 'linear-gradient(135deg, #F9A8D4 0%, #E5E7EB 100%)',
    },
    item: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#F9A8D4',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#E5E7EB',
        borderRightColor: '#E5E7EB',
        borderBottomColor: '#E5E7EB',
        shadowColor: '#F9A8D4',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    textContainer: {
        // Kontainer untuk Nama dan Koordinat
        flex: 1, // Memungkinkan teks menggunakan ruang yang tersisa
        marginRight: 10, // Memberi sedikit jarak dari ikon
    },

    itemName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
        letterSpacing: 0.3,
    },

    iconContainer: {
        // Kontainer untuk Ikon Pensil dan Sampah
        flexDirection: 'row', // Mengatur ikon secara horizontal
        alignItems: 'center',
    },

    iconButton: {
        padding: 5,
        marginLeft: 10, // Memberi jarak antar ikon
    }

});
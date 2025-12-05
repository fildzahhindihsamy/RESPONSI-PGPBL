import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useFocusEffect, useRouter } from 'expo-router';
import { ref, onValue } from "firebase/database";
import { db } from '@/config/firebaseConfig';
import { FontAwesome5 } from '@expo/vector-icons';

const getMarkerColor = (status) => {
    switch (status) {
        case "Berfungsi":
            return "green";
        case "Rusak":
            return "yellow";
        default:
            return "red";
    }
};

// --- PERUBAHAN DI SINI: Tentukan region awal sesuai permintaan ---
const INITIAL_MAP_REGION = {
    latitude: -7.7870268,
    longitude: 110.3708839,
    latitudeDelta: 0.0922, // Tingkat zoom peta
    longitudeDelta: 0.0421,
};

const MapsScreen = () => {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            const perlintasanRef = ref(db, 'perlintasan/');

            const unsubscribe = onValue(perlintasanRef, (snapshot) => {
                if (snapshot.exists()) {
                    const snapshotValue = snapshot.val();
                    const processedData = Object.entries(snapshotValue).map(([id, item]: [string, any]) => {
                        const latStr = String(item.latitude || '').replace(',', '.');
                        const lonStr = String(item.longitude || '').replace(',', '.');
                        
                        const latitude = parseFloat(latStr);
                        const longitude = parseFloat(lonStr);

                        if (!isNaN(latitude) && !isNaN(longitude)) {
                            return {
                                id: id,
                                latitude: latitude,
                                longitude: longitude,
                                namaPerlintasan: item.namaPerlintasan,
                                jenisPalang: item.jenisPalang,
                                status: item.status,
                                risiko: item.risiko,
                            };
                        }
                        return null;
                    }).filter(item => item !== null);

                    setMarkers(processedData);

                    // Fitur auto-zoom ke marker pertama tetap ada
                    if (processedData.length > 0 && mapRef.current) {
                        const firstMarker = processedData[0];
                        const regionToAnimate = {
                            latitude: firstMarker.latitude,
                            longitude: firstMarker.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        };
                        mapRef.current.animateToRegion(regionToAnimate, 1000);
                    }
                } else {
                    setMarkers([]);
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching map data from RTDB: ", error);
                setLoading(false);
            });

            return () => unsubscribe();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Memuat Peta...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                // --- PERUBAHAN DI SINI: Gunakan region awal yang sudah didefinisikan ---
                initialRegion={INITIAL_MAP_REGION}
                showsUserLocation={true}
                zoomControlEnabled={true}
            >
                {markers.map(item => (
                    <Marker
                        key={item.id}
                        coordinate={{
                            latitude: item.latitude,
                            longitude: item.longitude,
                        }}
                        pinColor={getMarkerColor(item.status)}
                        title={item.namaPerlintasan}
                        description={`Jenis: ${item.jenisPalang} | Risiko: ${item.risiko}`}
                    />
                ))}
            </MapView>
            
            <TouchableOpacity style={styles.fab} onPress={() => router.push('/form')}>
                <FontAwesome5 name="plus" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    map: { ...StyleSheet.absoluteFillObject },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#007BFF',
        borderRadius: 28,
        elevation: 8,
    },
});

export default MapsScreen;
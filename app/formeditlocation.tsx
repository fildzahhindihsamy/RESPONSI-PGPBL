import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";


const App = () => {
    const params = useLocalSearchParams();
    const { id, name: initialname, coordinates: initialcoordinates, accuration: initialaccuration } = params;
    const [name, setName] = useState(initialname);
    const [location, setLocation] = useState(initialcoordinates);
    const [accuration, setAccuration] = useState(initialaccuration);
    const router = useRouter();

    // Get current location
    const getCoordinates = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const coords = location.coords.latitude + ',' + location.coords.longitude;
        setLocation(coords);


        const accuracy = location.coords.accuracy;
        setAccuration(accuracy + ' m');
    };

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

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // Alert success update
    const createOneButtonAlert = (callback) =>
        Alert.alert('Success', 'Berhasil memperbarui data', [
            { text: 'OK', onPress: callback },
        ]);


    // Handle update
    const handleUpdate = () => {
        if (!id) {
            Alert.alert("Error", "ID lokasi tidak ditemukan.");
            return;
        }
        const pointRef = ref(db, `points/${id}`);
        update(pointRef, {
            name: name,
            coordinates: location,
            accuration: accuration,
        }).then(() => {
            createOneButtonAlert(() => {
                router.back();
            });
        }).catch((e) => {
            console.error("Error updating document: ", e);
            Alert.alert("Error", "Gagal memperbarui data");
        });
    };


    return (
        <SafeAreaProvider style={{ backgroundColor: 'white' }}>
            <SafeAreaView>
                <Stack.Screen options={{ title: 'Form Edit Location' }} />
                <Text style={styles.inputTitle}>Nama</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Isikan nama objek'
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.inputTitle}>Koordinat</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Isikan koordinat (contoh: -6.200000,106.816666)"
                    value={location}
                    onChangeText={setLocation}
                />
                <Text style={styles.inputTitle}>Akurasi</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Isikan accuration (contoh: 5 meter)"
                    value={accuration}
                    onChangeText={setAccuration}
                />
                <View style={styles.button}>
                    <Button
                        title="Get Current Location"
                        onPress={getCoordinates}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        title="Save"
                        onPress={handleUpdate}
                    />

                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};


const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    inputTitle: {
        marginLeft: 12,
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        margin: 12,
    }
});


export default App;
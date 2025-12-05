import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';

// ==== REALTIME DATABASE ====
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, update, get } from "firebase/database";

// CONFIG — SAMA DENGAN PROJECT LAMA
const firebaseConfig = {
  apiKey: "AIzaSyBOVT_iCy4XjqMgyVdxE5YNiHSDZJJmYh0",
  authDomain: "reacnative-6e58d.firebaseapp.com",
  databaseURL: "https://reacnative-6e58d-default-rtdb.firebaseio.com",
  projectId: "reacnative-6e58d",
  storageBucket: "reacnative-6e58d.firebasestorage.app",
  messagingSenderId: "571914017319",
  appId: "1:571914017319:web:28f1107088f147d8b94c02"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// === DROPDOWN OPTIONS ===
const JENIS_PALANG_OPTIONS = ["Otomatis", "Manual", "Tidak Ada"];
const RISIKO_OPTIONS = ["Rendah", "Sedang", "Tinggi"];
const STATUS_BERFUNGSI_OPTIONS = ["Berfungsi", "Rusak"];
const STATUS_TIDAK_ADA_OPTIONS = ["Belum Dibangun", "Hilang Karena Kecelakaan"];


export default function FormPerlintasanScreen() {

  const params = useLocalSearchParams();
  const router = useRouter();
  const isEditMode = params.id != null;

  const [id, setId] = useState(params.id?.toString());
  const [loading, setLoading] = useState(true);

  // === STATE ===
  const [namaPerlintasan, setNamaPerlintasan] = useState('');
  const [kecamatanKabupaten, setKecamatanKabupaten] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [jenisPalang, setJenisPalang] = useState(JENIS_PALANG_OPTIONS[0]);
  const [status, setStatus] = useState('');
  const [risiko, setRisiko] = useState(RISIKO_OPTIONS[0]);
  const [deskripsi, setDeskripsi] = useState('');


  // === FETCH DATA (EDIT MODE) ===
  useEffect(() => {
    if (isEditMode) {
      const refDB = ref(db, `perlintasan/${id}`);
      get(refDB).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setNamaPerlintasan(data.namaPerlintasan || '');
          setKecamatanKabupaten(data.kecamatanKabupaten || '');
          setLatitude(data.latitude?.toString() || '');
          setLongitude(data.longitude?.toString() || '');
          setJenisPalang(data.jenisPalang || JENIS_PALANG_OPTIONS[0]);
          setStatus(data.status || '');
          setRisiko(data.risiko || RISIKO_OPTIONS[0]);
          setDeskripsi(data.deskripsi || '');
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

  }, []);


  // === Dropdown Condition ===
  useEffect(() => {
    if (jenisPalang === "Otomatis" || jenisPalang === "Manual") {
      if (!STATUS_BERFUNGSI_OPTIONS.includes(status)) {
        setStatus(STATUS_BERFUNGSI_OPTIONS[0]);
      }
    } else {
      if (!STATUS_TIDAK_ADA_OPTIONS.includes(status)) {
        setStatus(STATUS_TIDAK_ADA_OPTIONS[0]);
      }
    }
  }, [jenisPalang]);


  // === GET COORDINATES ===
  const getCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Lokasi Ditolak');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLatitude(loc.coords.latitude.toString());
    setLongitude(loc.coords.longitude.toString());
  };


  // === SAVE ===
  const handleSave = async () => {

    if (!namaPerlintasan || !latitude || !longitude) {
      Alert.alert("Data Belum Lengkap", "Nama & Koordinat wajib terisi");
      return;
    }

    const dataToSave = {
      namaPerlintasan,
      kecamatanKabupaten,
      latitude,
      longitude,
      jenisPalang,
      status,
      risiko,
      deskripsi,
    };

    try {
      if (isEditMode) {
        // UPDATE
        const refDB = ref(db, `perlintasan/${id}`);
        await update(refDB, dataToSave);

        Alert.alert("Sukses", "Data berhasil diperbarui", [
          { text: "OK", onPress: () => router.push("/maps") }
        ]);

      } else {
        // ADD NEW
        const refDB = ref(db, "perlintasan/");
        const newRef = await push(refDB, dataToSave);

        Alert.alert("Sukses", "Data baru berhasil disimpan", [
          { text: "OK", onPress: () => router.push("/maps") }
        ]);
      }

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };


  // === DROPDOWN RENDER ===
  const renderDropdown = (label, options, selected, onSelect) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputTitle}>{label}</Text>

      <View style={styles.dropdownContainer}>
        {options.map(op => (
          <TouchableOpacity
            key={op}
            style={[
              styles.dropdownOption,
              selected === op && styles.dropdownOptionSelected
            ]}
            onPress={() => onSelect(op)}
          >
            <Text style={selected === op ? styles.dropdownTextSelected : styles.dropdownText}>
              {op}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );


  if (loading) return <View style={{ padding: 20 }}><Text>Loading...</Text></View>;


  return (
    <ScrollView style={styles.scrollContainer}>
      <Stack.Screen options={{ title: isEditMode ? "Edit Perlintasan" : "Tambah Perlintasan" }} />

      <View style={styles.formContainer}>

        {/* INFO LOKASI */}
        <Text style={styles.sectionTitle}>1. Informasi Lokasi</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Nama Perlintasan</Text>
          <TextInput style={styles.input} value={namaPerlintasan} onChangeText={setNamaPerlintasan} placeholder="Contoh: JPL 123" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Kecamatan & Kabupaten</Text>
          <TextInput style={styles.input} value={kecamatanKabupaten} onChangeText={setKecamatanKabupaten} placeholder="Contoh: Gondokusuman, Yogyakarta" />
        </View>

        <View style={styles.coordsContainer}>
          <View style={styles.coordInput}>
            <Text style={styles.inputTitle}>Latitude</Text>
            <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} keyboardType="numeric" />
          </View>
          <View style={styles.coordInput}>
            <Text style={styles.inputTitle}>Longitude</Text>
            <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Ambil Lokasi Saat Ini" onPress={getCoordinates} />
        </View>


        {/* DETAIL TEKNIS */}
        <Text style={styles.sectionTitle}>2. Detail Teknis</Text>

        {renderDropdown("Jenis Palang", JENIS_PALANG_OPTIONS, jenisPalang, setJenisPalang)}
        {renderDropdown("Status", jenisPalang === "Tidak Ada" ? STATUS_TIDAK_ADA_OPTIONS : STATUS_BERFUNGSI_OPTIONS, status, setStatus)}
        {renderDropdown("Risiko", RISIKO_OPTIONS, risiko, setRisiko)}


        {/* DESKRIPSI */}
        <Text style={styles.sectionTitle}>3. Keterangan Tambahan</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Deskripsi Kondisi</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={deskripsi}
            onChangeText={setDeskripsi}
            placeholder="Contoh: Palang sering macet..."
          />
        </View>


        <View style={styles.buttonWrapper}>
          <Button title={isEditMode ? "Simpan Perubahan" : "Simpan"} onPress={handleSave} />
        </View>

      </View>
    </ScrollView>
  );
}


// ======= STYLES =======
const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#F8F9FA" },
  formContainer: { padding: 16, paddingBottom: 50 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 24, marginBottom: 8 },
  inputContainer: { marginBottom: 16 },
  inputTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "white", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1 },
  textarea: { height: 100, textAlignVertical: "top" },
  coordsContainer: { flexDirection: "row", justifyContent: "space-between" },
  coordInput: { flex: 1, marginRight: 8 },
  buttonWrapper: { marginTop: 20 },

  dropdownContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  dropdownOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: "#E9ECEF" },
  dropdownOptionSelected: { backgroundColor: "#007BFF" },
  dropdownTextSelected: { color: "white", fontWeight: "bold" },
  dropdownText: { fontWeight: "500" }
});

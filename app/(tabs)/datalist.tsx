import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
// 1. Impor fungsi-fungsi dari Realtime Database
import { ref, onValue, remove } from "firebase/database";
// 2. Impor 'db' (Realtime Database instance) dari konfigurasi Anda
import { db } from "@/config/firebaseConfig";
import { ThemedText } from "@/components/themed-text";

// Helper Functions (tidak berubah)
const getRiskColor = (risiko) => {
  switch (risiko) {
    case "Tinggi":
      return "#D9534F";
    case "Sedang":
      return "#F0AD4E";
    case "Rendah":
      return "#5CB85C";
    default:
      return "#777";
  }
};

const navigateToMap = (lat, lng) => {
  if (!lat || !lng) {
    Alert.alert("Error", "Koordinat tidak valid.");
    return;
  }
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  Linking.openURL(url);
};

const DataListScreen = () => {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  const [sortOrder, setSortOrder] = useState("Tinggi");

  // 3. Mengganti listener Firestore dengan Realtime Database
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const perlintasanRef = ref(db, "perlintasan/"); // Path ke node utama

      const unsubscribe = onValue(
        perlintasanRef,
        (snapshot) => {
          if (snapshot.exists()) {
            // Mengubah objek dari snapshot menjadi array
            const data = Object.entries(snapshot.val()).map(
              ([id, item]) => ({
                id,
                ...item,
              })
            );
            setList(data);
          } else {
            setList([]); // Set list kosong jika tidak ada data
          }
          setLoading(false);
        },
        (err) => {
          console.log("❌ Error fetch data:", err);
          Alert.alert("Error", "Gagal memuat data dari Realtime Database.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }, [])
  );

  // Filter + Sort (tidak berubah, karena bekerja pada state 'list')
  const finalList = useMemo(() => {
    const riskLevel = { Tinggi: 3, Sedang: 2, Rendah: 1 };
    return list
      .filter((i) => filter === "Semua" || i.jenisPalang === filter)
      .sort((a, b) => {
        if (sortOrder === "Tinggi") {
          return (riskLevel[b.risiko] || 0) - (riskLevel[a.risiko] || 0);
        }
        return (riskLevel[a.risiko] || 0) - (riskLevel[b.risiko] || 0);
      });
  }, [list, filter, sortOrder]);

  // 4. Mengganti fungsi hapus ke Realtime Database
  const handleDelete = (id, name) => {
    Alert.alert(
      "Hapus Data",
      `Yakin ingin menghapus perlintasan "${name}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              // Menggunakan remove dari RTDB
              await remove(ref(db, `perlintasan/${id}`));
              Alert.alert("Sukses", "Data berhasil dihapus.");
            } catch (error) {
              console.error("Gagal menghapus data:", error);
              Alert.alert("Error", "Gagal menghapus data.");
            }
          },
        },
      ]
    );
  };

  // Detail popup (tidak berubah)
  const handleDetail = (item) => {
    Alert.alert(
      "Detail Perlintasan",
      `
Nama: ${item.namaPerlintasan || "-"}
Lokasi: ${item.kecamatanKabupaten || "-"}
Jenis Palang: ${item.jenisPalang || "-"}
Status: ${item.status || "-"}
Risiko: ${item.risiko || "-"}
Deskripsi: ${item.deskripsi || "-"}
Koordinat: ${item.latitude}, ${item.longitude}
      `,
      [
        { text: "Tutup", style: "cancel" },
        {
          text: "Lihat di Peta",
          onPress: () => navigateToMap(item.latitude, item.longitude),
        },
      ]
    );
  };

  // Render UI (sebagian besar tidak berubah)
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{item.namaPerlintasan}</ThemedText>
        <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.risiko) }]}>
          <Text style={styles.riskText}>{item.risiko}</Text>
        </View>
      </View>

      <Text style={styles.cardInfo}>Lokasi: {item.kecamatanKabupaten}</Text>
      <Text style={styles.cardInfo}>Jenis Palang: {item.jenisPalang}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonDetail]} onPress={() => handleDetail(item)}>
          <Text style={styles.buttonText}>Detail & Peta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonEdit]}
          onPress={() => router.push({ pathname: "/form", params: { id: item.id } })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonDelete]}
          onPress={() => handleDelete(item.id, item.namaPerlintasan)}
        >
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.screenTitle}>Data Perlintasan</ThemedText>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter Palang:</Text>
        {["Semua", "Otomatis", "Manual", "Tidak Ada"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={filter === f ? styles.filterTextActive : styles.filterText}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={finalList}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Belum ada data.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA", paddingTop: 20 },
    screenTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
    listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
    card: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E9ECEF', shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    cardTitle: { fontSize: 18, fontWeight: "bold" },
    cardInfo: { marginTop: 4, color: "#444" },
    riskBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    riskText: { color: "#FFF", fontWeight: "bold" },
    buttonContainer: { flexDirection: "row", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F3F5', justifyContent: "flex-end" },
    button: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginLeft: 8 },
    buttonDetail: { backgroundColor: "#0275D8" },
    buttonEdit: { backgroundColor: "#F0AD4E" },
    buttonDelete: { backgroundColor: "#D9534F" },
    buttonText: { color: "#FFF", fontWeight: "600" },
    emptyText: { textAlign: "center", padding: 40, color: "#777" },
    filterContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingBottom: 12, gap: 8 },
    filterLabel: { fontWeight: "bold" },
    filterButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: "#E9ECEF" },
    filterButtonActive: { backgroundColor: "#0275D8" },
    filterText: { color: "#444" },
    filterTextActive: { color: "#FFF" },
});

export default DataListScreen;
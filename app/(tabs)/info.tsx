import { ThemedText } from '@/components/themed-text';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const InfoSection = ({ title, children }) => (
    <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <View style={styles.sectionContent}>
            {children}
        </View>
    </View>
);

const InfoText = ({ children }) => <Text style={styles.text}>{children}</Text>;
const BulletPoint = ({ text }) => <View style={styles.bullet}><Text style={styles.bulletText}>•</Text><Text style={styles.text}>{text}</Text></View>;

const ContactButton = ({ title, icon, phone }) => (
    <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(`tel:${phone}`)}>
        <FontAwesome5 name={icon} size={20} color="white" />
        <Text style={styles.contactText}>{title}</Text>
    </TouchableOpacity>
);


export default function InfoScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Info & Bantuan</ThemedText>
            </View>

            <View style={styles.contentContainer}>
                <InfoSection title="Panduan Aplikasi">
                    <InfoText>Aplikasi ini digunakan untuk mendata dan memvisualisasikan perlintasan kereta api.</InfoText>
                    <BulletPoint text="Home: Menampilkan ringkasan data dan tombol aksi cepat." />
                    <BulletPoint text="Data: Menampilkan seluruh data perlintasan dalam bentuk daftar yang bisa di-filter dan diurutkan." />
                    <BulletPoint text="Peta: Menampilkan visualisasi semua perlintasan di peta dengan penanda berwarna." />
                    <BulletPoint text="Info: Halaman ini berisi panduan dan kontak darurat." />
                </InfoSection>

                <InfoSection title="Aturan Input Data">
                    <InfoText style={styles.subTitle}>Jenis Palang:</InfoText>
                    <BulletPoint text="Otomatis: Palang pintu digerakkan oleh sistem secara otomatis." />
                    <BulletPoint text="Manual: Palang pintu dioperasikan oleh penjaga." />
                    <BulletPoint text="Tidak Ada: Perlintasan tidak memiliki palang pintu." />
                    
                    <InfoText style={styles.subTitle}>Status Palang:</InfoText>
                    <BulletPoint text="Berfungsi: Palang dapat beroperasi dengan normal." />
                    <BulletPoint text="Rusak: Terdapat kerusakan pada palang atau sistemnya." />
                    <BulletPoint text="Belum Dibangun: Untuk perlintasan liar/baru yang belum ada infrastruktur." />
                    <BulletPoint text="Hilang Karena Kecelakaan: Infrastruktur rusak/hilang akibat insiden." />

                    <InfoText style={styles.subTitle}>Tingkat Risiko:</InfoText>
                    <BulletPoint text="Tinggi: Perlintasan liar, tanpa palang, visibilitas rendah, sangat ramai." />
                    <BulletPoint text="Sedang: Perlintasan dijaga, namun volume kendaraan tinggi atau palang manual." />
                    <BulletPoint text="Rendah: Perlintasan resmi dengan palang otomatis dan kondisi ideal." />
                </InfoSection>
                
                <InfoSection title="Logika Warna Marker Peta">
                    <BulletPoint text="Hijau: Palang Berfungsi." />
                    <BulletPoint text="Kuning: Palang Rusak." />
                    <BulletPoint text="Merah: Tidak Ada Palang (termasuk belum dibangun/hilang)." />
                </InfoSection>
                
                <InfoSection title="SOP Petugas Lapangan">
                    <BulletPoint text="Selalu utamakan keselamatan diri." />
                    <BulletPoint text="Ambil foto dokumentasi jika memungkinkan (fitur selanjutnya)." />
                    <BulletPoint text="Gunakan tombol 'Ambil Lokasi Saat Ini' untuk akurasi data koordinat." />
                    <BulletPoint text="Isi semua field data dengan informasi yang paling akurat." />
                </InfoSection>

                <InfoSection title="Kontak Darurat">
                    <ContactButton title="KAI Command Center" icon="train" phone="121" />
                    <ContactButton title="Dinas Perhubungan Lokal" icon="road" phone="151" />
                </InfoSection>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#007BFF',
        padding: 30,
        paddingTop: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    contentContainer: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#343A40',
        borderBottomWidth: 2,
        borderBottomColor: '#DEE2E6',
        paddingBottom: 5,
    },
    sectionContent: {
        paddingLeft: 10,
    },
    subTitle: {
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
        color: '#495057'
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: '#495057',
        marginBottom: 5,
    },
    bullet: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bulletText: {
        fontSize: 16,
        marginRight: 8,
        lineHeight: 24,
        color: '#495057',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    contactText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 15,
    },
});
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/logo-ugm-blue.jpeg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.tittle}>Selamat Datang!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.subtitle}>Nama</ThemedText>
        <ThemedText>
          Fildzah Hind Ihsamy
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.subtitle}>NIM</ThemedText>
        <ThemedText>
          23/522655/SV/23746
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.subtitle}>Mata Kuliah</ThemedText>
        <ThemedText>
          Praktikum Pemrograman Geospasial Perangkat Bergerak Lanjut
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.subtitle}>Aplikasi</ThemedText>
        <ThemedText>
          Aplikasi ini dijalankan di perangkat <ThemedText type="defaultSemiBold">{Platform.select({
            ios: 'iOS',
            android: 'Android',
            web: 'Web',
          })}</ThemedText> menggunakan React Native dan Expo.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.subtitle}>Mata Kuliah</ThemedText>
        <ThemedText>
          Praktikum Pemrograman Geospasial Perangkat Bergerak Lanjut
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 180,
    width: 180,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  tittle: {
    color: 'green',
  },
  subtitle: {
    color: 'blue',
  },
});

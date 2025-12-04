import React from 'react';
import { StyleSheet, TextInput, Text, Button, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

const TextInputExample = () => {
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Stack.Screen options={{ title: 'Form Input' }} />
        <Text style={styles.inputTitle}>Nama</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder='Isikan Nama Mahasiswa'
        />
        <Text style={styles.inputTitle}>NIM</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="Isikan Nomor Induk Mahasiswa"
        />
        <Text style={styles.inputTitle}>Kelas</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder='Isikan Kelas'
        />
        <View style={styles.button}>
          <Button
            title="Save"
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
    borderRadius: 10,
  },
  inputTitle: {
    marginLeft: 12,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginLeft: 12,
    marginTop: 26,
    borderRadius: 12,
  }
});

export default TextInputExample;
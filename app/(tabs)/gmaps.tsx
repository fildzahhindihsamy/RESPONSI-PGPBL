import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


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


export default function MapScreen() {
 const [markers, setMarkers] = useState([]);
 const [loading, setLoading] = useState(true);


 useEffect(() => {
   const pointsRef = ref(db, 'points/');
  
   const unsubscribe = onValue(pointsRef, (snapshot) => {
     const data = snapshot.val();
     if (data) {
       const parsedMarkers = Object.keys(data)
         .map(key => {
           const point = data[key];
           // Ensure coordinates is a string and not empty
           if (typeof point.coordinates !== 'string' || point.coordinates.trim() === '') {
             return null;
           }
           const [latitude, longitude] = point.coordinates.split(',').map(Number);
          
           // Validate that parsing was successful
           if (isNaN(latitude) || isNaN(longitude)) {
             console.warn(`Invalid coordinates for point ${key}:`, point.coordinates);
             return null;
           }


           return {
             id: key,
             name: point.name,
             latitude,
             longitude,
           };
         })
         .filter(Boolean); // Filter out any null entries from invalid data


       setMarkers(parsedMarkers);
     } else {
       setMarkers([]);
     }
     setLoading(false);
   }, (error) => {
     console.error(error);
     setLoading(false);
   });


   return () => unsubscribe();
 }, []);


 if (loading) {
   return (
     <View style={styles.container}>
       <ActivityIndicator size="large" />
       <Text>Loading map data...</Text>
     </View>
   );
 }


 // Render the map on native platforms
 return (
   <View style={styles.container}>
     <MapView
       style={styles.map}
       initialRegion={{
         latitude: -7.7956,
         longitude: 110.3695,
         latitudeDelta: 0.02,
         longitudeDelta: 0.01,
       }}
       zoomControlEnabled={true}
     >
       {markers.map(marker => (
         <Marker
           key={marker.id}
           coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
           title={marker.name}
           description={`Coords: ${marker.latitude}, ${marker.longitude}`}
         />
       ))}
     </MapView>
     <TouchableOpacity style={styles.fab} onPress={() => router.push('/forminputlocation')}>
             <FontAwesome5 name="plus" size={24} color="white" />
           </TouchableOpacity>
   </View>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 map: {
   // ...StyleSheet.absoluteFillObject,
   width: '100%',
   height: '100%',
 },
 fab: {
   position: 'absolute',
   width: 56,
   height: 56,
   alignItems: 'center',
   justifyContent: 'center',
   left: 20,
   bottom: 20,
   backgroundColor: '#0275d8',
   borderRadius: 30,
   elevation: 8,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
 },
});
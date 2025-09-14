import * as Location from "expo-location";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import ElephantIcon from "../assets/elephant.png";
import { db } from "../firebaseConfig";

export default function UploadLocation() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(""); // 📍 store location name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need location access to show map.");
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      // 🔄 Reverse geocoding (skip place.name to avoid "6GCG+54")
      let reverseGeocode = await Location.reverseGeocodeAsync(currentLocation.coords);
      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];

        // Collect non-empty values
        const parts = [place.street, place.city, place.region, place.country].filter(Boolean);

        // Join nicely with commas or spaces
        setLocationName(parts.join(", "));
      }

      setLoading(false);
    })();
  }, []);

  const handleUpload = async () => {
    if (!location) return;

    try {
      await addDoc(collection(db, "guestLocations"), {
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: locationName || "Unknown Location", // 📍 save location name
        timestamp: Timestamp.now(),
      });
      Alert.alert("Success", "Location uploaded successfully!");
    } catch (error) {
      console.error("Error uploading location:", error);
      Alert.alert("Error", "Failed to upload location.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Elephant Location"
            description={locationName} // 📍 show location name on marker
          >
            <Image source={ElephantIcon} style={{ width: 40, height: 40 }} /> 
          </Marker>
        </MapView>
      ) : (
        <Text>No location available</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>Upload Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    margin: 35,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

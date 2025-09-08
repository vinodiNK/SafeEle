// app/OpenMap.jsx
import * as Location from "expo-location";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { db } from "../firebaseConfig";

export default function OpenMap() {
  const [location, setLocation] = useState(null);
  const [elephantLocations, setElephantLocations] = useState([]);
  const [guestLocations, setGuestLocations] = useState([]);

  // Get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // Fetch elephant locations in realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "elephant_locations"), (snapshot) => {
      const locations = snapshot.docs.map((doc) => doc.data());
      setElephantLocations(locations);
    });
    return unsubscribe;
  }, []);

  // Fetch guest locations in realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "guestLocations"), (snapshot) => {
      const locations = snapshot.docs.map((doc) => doc.data());
      setGuestLocations(locations);
    });
    return unsubscribe;
  }, []);

  if (!location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2d6a4f" />
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* User location */}
      <Marker
        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        title="You are here"
        pinColor="#2d6a4f"
      />

      {/* Elephant locations */}
      {elephantLocations.map((elephant, index) => (
        <Marker
          key={`elephant-${index}`}
          coordinate={{
            latitude: elephant.latitude,
            longitude: elephant.longitude,
          }}
          title="Elephant Location"
          description="Reported in Firestore"
        >
          <Image
            source={require("../assets/elephant.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </Marker>
      ))}

      {/* Guest locations */}
      {guestLocations.map((guest, index) => (
        <Marker
          key={`guest-${index}`}
          coordinate={{
            latitude: guest.latitude,
            longitude: guest.longitude,
          }}
          title="Guest Location"
          description="Reported in Firestore"
        >
          <Image
            source={require("../assets/elephant.png")} // 👈 Add guest.png in assets
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

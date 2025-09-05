// app/OpenMap.jsx
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function OpenMap() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
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
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        title="You are here"
        pinColor="#2d6a4f"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

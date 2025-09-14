// app/CollisionZone.jsx
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";

export default function CollisionZone() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the elephant_locations collection, ordered by timestamp descending
    const q = query(collection(db, "elephant_locations"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const locs = [];
      querySnapshot.forEach((doc) => {
        locs.push({ id: doc.id, ...doc.data() });
      });
      setLocations(locs);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  // Open location in Google Maps
  const openInMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Past Elephant Collision Zones</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.locationName}>{item.locationName}</Text>
            
            <Text>
              Date & Time: {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : item.timestamp}
            </Text>

            {/* Open Map Button */}
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => openInMap(item.latitude, item.longitude)}
            >
              <Text style={styles.mapButtonText}>Open in Map</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  locationName: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  mapButton: {
    marginTop: 10,
    backgroundColor: "#2e8b57",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  mapButtonText: { color: "#fff", fontWeight: "bold" },
});

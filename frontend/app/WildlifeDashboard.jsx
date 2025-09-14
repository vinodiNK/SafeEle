// app/WildLifeDashboard.jsx
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../firebaseConfig";

export default function WildLifeDashboard() {
  const [elephants, setElephants] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Fix collection name: elephant_locations (not elephants_locations)
    const q1 = query(collection(db, "elephant_locations"), orderBy("timestamp", "desc"));
    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setElephants(data);
      setLoading(false);
    });

    const q2 = query(collection(db, "guestLocations"), orderBy("timestamp", "desc"));
    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGuests(data);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#1e88e5" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Past Elephant Collision Zone</Text>
      <FlatList
        data={elephants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Elephant spotted at:</Text>
            {/* ✅ Show new locationName field */}
            <Text style={styles.location}>
              {item.locationName ? item.locationName : "Unknown location"}
            </Text>
            <Text style={styles.date}>
              {item.timestamp?.seconds
                ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                : "No time"}
            </Text>
          </View>
        )}
      />

      <Text style={styles.header}>Guest Updated Elephants Locations</Text>
      <FlatList
        data={guests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Guest at:</Text>
            <Text style={styles.location}>
              {item.locationName ? item.locationName : "Unknown location"}
            </Text>
            <Text style={styles.date}>
              {item.timestamp?.seconds
                ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                : "No time"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#1e88e5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 3,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  location: { fontSize: 16, marginTop: 4, color: "#2d6a4f" },
  date: { fontSize: 12, color: "gray", marginTop: 6 },
});

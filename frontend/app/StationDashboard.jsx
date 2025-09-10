// app/StationDashboard.jsx
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../firebaseConfig";

export default function StationDashboard() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Station News Updates</Text>
      <FlatList
        data={newsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.station}>Station: {item.station}</Text>
            <Text style={styles.news}>{item.news}</Text>
            <Text style={styles.date}>
              {item.createdAt?.toDate().toLocaleString() || "Just now"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#1e88e5" },
  station: { fontSize: 14, color: "#444", marginTop: 5 },
  news: { fontSize: 16, marginTop: 8 },
  date: { fontSize: 12, color: "gray", marginTop: 6, textAlign: "right" },
});

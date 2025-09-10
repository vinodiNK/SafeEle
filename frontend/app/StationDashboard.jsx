// app/StationDashboard.jsx
import { useNavigation } from "@react-navigation/native"; // ✅ for navigation
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";

export default function StationDashboard() {
  const [newsList, setNewsList] = useState([]);
  const navigation = useNavigation(); // ✅ navigation hook

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
      {/* ✅ Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>

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
  backButton: {
  position: "absolute",
  bottom: 30,            // place near bottom (adjust as needed)
  left: "10%",           // start 10% from left
  right: "10%",          // end 10% from right → makes button long & centered
  paddingVertical: 15,   // increase height
  backgroundColor: "#208140ff",
  borderRadius: 25,      // smooth rounded corners
  alignItems: "center",  // center the text
  justifyContent: "center",
  zIndex: 10,
},
  backText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
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

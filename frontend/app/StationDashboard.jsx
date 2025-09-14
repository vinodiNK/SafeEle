// app/StationDashboard.jsx
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";

export default function StationDashboard() {
  const [newsList, setNewsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // simulate refresh
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.station}>Station: {item.station}</Text>
      <Text style={styles.news}>{item.news}</Text>
      <Text style={styles.date}>
        {item.createdAt?.toDate().toLocaleString() || "Just now"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Station News Updates</Text>

      {/* News List */}
      <FlatList
        data={newsList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Login")}
        activeOpacity={0.8}
      >
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#1e88e5" },
  backButton: {
    position: "absolute",
    bottom: 30,
    left: "10%",
    right: "10%",
    paddingVertical: 15,
    backgroundColor: "#208140",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 5,
  },
  backText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
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

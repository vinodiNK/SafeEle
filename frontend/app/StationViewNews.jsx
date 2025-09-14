// app/StationViewNews.jsx
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../firebaseConfig";

export default function StationViewNews({ route }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Optional: if you want to filter by station
  const stationName = route?.params?.station || null;

  useEffect(() => {
    let q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    
    if (stationName) {
      q = query(collection(db, "news"), where("station", "==", stationName), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsArray = [];
      snapshot.forEach((doc) => {
        newsArray.push({ id: doc.id, ...doc.data() });
      });
      setNewsList(newsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Station News</Text>

      <FlatList
        data={newsList}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <Text style={styles.noDataText}>No news found</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.station}>Station: {item.station}</Text>
            <Text style={styles.news}>{item.news}</Text>
            <Text style={styles.date}>
              {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : item.createdAt}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#2e8b57" },
  item: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
  station: { fontStyle: "italic", marginBottom: 5 },
  news: { marginBottom: 5 },
  date: { fontSize: 12, color: "#888" },
  noDataText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#888" },
});

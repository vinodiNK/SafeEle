// app/StationViewNews.jsx
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebaseConfig";

export default function StationViewNews({ route }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  const stationName = route?.params?.station || null;

  useEffect(() => {
    let q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    if (stationName) {
      q = query(collection(db, "news"), where("station", "==", stationName), orderBy("createdAt", "desc"));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsArray = [];
      snapshot.forEach((doc) => newsArray.push({ id: doc.id, ...doc.data() }));
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
      <Text style={styles.header}>Engine Driver News</Text>

      <FlatList
        data={newsList}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <Text style={styles.noDataText}>No news found</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.trainName}>{item.trainName}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.station}>Station: {item.station}</Text>
            <Text style={styles.news}>{item.news}</Text>
            <Text style={styles.date}>
              {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : item.createdAt}
            </Text>
          </View>
        )}
      />

      {/* Footer */}
      <LinearGradient colors={["#004d00", "#006400"]} style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("index")} style={styles.navButton}>
          <Entypo name="home" size={24} color="#c8e6c9" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Message")} style={styles.navButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#c8e6c9" />
          <Text style={styles.footerText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("StationViewNews")} style={styles.navButton}>
          <Entypo name="news" size={24} color="#c8e6c9" />
          <Text style={styles.footerText}>News</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.navButton}>
          <FontAwesome5 name="user-alt" size={24} color="#c8e6c9" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5", paddingBottom: 90 },
  header: { fontSize: 35, marginTop: 25, marginBottom: 15, color: "#2E8B57", textAlign: "center", fontWeight: "bold" },
  item: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  trainName: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 5, color: "#3080dbff" },
  station: { fontStyle: "italic", marginBottom: 5 },
  news: { marginBottom: 5 },
  date: { fontSize: 12, color: "#888" },
  noDataText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#888" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#c8e6c9", fontSize: 12, marginTop: 2 },
});

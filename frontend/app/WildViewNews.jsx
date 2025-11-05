// app/WildViewNews.jsx
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../firebaseConfig";

export default function WildViewNews() {
  const navigation = useNavigation();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Hide the top navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // ✅ Real-time listener for Firestore updates
  useEffect(() => {
    const q = query(collection(db, "StationSendNews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsData(newsList);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>Wildlife Department News</Text>
        <Text style={styles.subTitle}>Real-time updates from Stations</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : newsData.length === 0 ? (
        <Text style={styles.noData}>No messages found.</Text>
      ) : (
        <FlatList
          data={newsData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.stationText}>📍 {item.station}</Text>
              <Text style={styles.titleText}>📰 {item.title}</Text>
              <Text style={styles.newsText}>{item.news}</Text>
              {item.createdAt && item.createdAt.seconds && (
                <Text style={styles.timeText}>
                  {new Date(item.createdAt.seconds * 1000).toLocaleString()}
                </Text>
              )}
            </View>
          )}
        />
      )}

      {/* Footer Navigation */}
      <LinearGradient colors={["#eaf1eaff", "#e5ece5ff"]} style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("index")} style={styles.navButton}>
          <Entypo name="home" size={24} color="#004d00" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("WildViewNews")}
          style={styles.navButton}
        >
          <Entypo name="news" size={24} color="#004d00" />
          <Text style={styles.footerTextActive}>News</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("WildProfile")}
          style={styles.navButton}
        >
          <FontAwesome5 name="user-alt" size={22} color="#004d00" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5e9", alignItems: "center" },
  headerWrapper: { marginTop: 60, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#2e7d32" },
  subTitle: { fontSize: 14, color: "#4CAF50", marginTop: 5 },
  card: {
    backgroundColor: "#C8E6C9",
    width: "100%",
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  stationText: { fontSize: 16, fontWeight: "bold", color: "#1b5e20" },
  titleText: { fontSize: 15, color: "#2e7d32", marginVertical: 4 },
  newsText: { fontSize: 14, color: "#33691e", marginTop: 5 },
  timeText: { fontSize: 11, color: "#004d00", marginTop: 8, textAlign: "right" },
  noData: { color: "#666", marginTop: 40, fontSize: 16 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2 },
  footerTextActive: { color: "#2E7D32", fontSize: 12, marginTop: 2, fontWeight: "bold" },
});

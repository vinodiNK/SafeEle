// app/WildViewNews.jsx
import {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from "react-native-svg";
import { db } from "../firebaseConfig";

export default function WildViewNews() {
  const navigation = useNavigation();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
      {/* 🌿 Curved Header */}
      <View style={styles.headerWrapper}>
        <Svg height="170" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Svg height="235" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad2)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>
        <Svg height="320" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Text style={styles.headerTitle}>Wildlife Department News</Text>
        <Text style={styles.subTitle}>Real-time updates from Stations</Text>
      </View>

      {/* 📰 News Content */}
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

      {/* 🌿 Footer Navigation */}
      <LinearGradient colors={["#eaf1eaff", "#e5ece5ff"]} style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("WildlifeDashboard")}
          style={styles.navButton}
        >
          <Entypo name="home" size={24} color="#004d00" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddCollision")}
          style={styles.navButton}
        >
          <MaterialCommunityIcons name="plus-circle" size={26} color="#004d00" />
          <Text style={styles.footerText}>Add Data</Text>
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
          <FontAwesome5 name="user-alt" size={24} color="#004d00" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingBottom: 90 },
  headerWrapper: { alignItems: "center", justifyContent: "center", marginBottom: 60 },
  curve: { position: "absolute", top: 0 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 80,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subTitle: { fontSize: 14, color: "#e0f2f1", marginTop: 5 },
  card: {
    backgroundColor: "#f5faf6ff",
    width: "90%",
    alignSelf: "center",
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    elevation: 3,
  },
  stationText: { fontSize: 16, fontWeight: "bold", color: "#0a0a0aff" },
  titleText: { fontSize: 15,fontWeight: "bold", color: "#129553ff", marginVertical: 4 },
  newsText: { fontSize: 14, color: "#0c1707ff", marginTop: 5 },
  timeText: { fontSize: 11, color: "#0e0f0eff", marginTop: 8, textAlign: "right" },
  noData: { color: "#666", marginTop: 40, fontSize: 16, textAlign: "center" },
  footer: {
    position: "absolute",
    bottom: 40,
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

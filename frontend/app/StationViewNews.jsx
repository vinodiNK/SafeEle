// app/StationViewNews.jsx
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from "react-native-svg";
import { db } from "../firebaseConfig";

export default function StationViewNews({ route }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const stationName = route?.params?.station || null;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    let q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    if (stationName) {
      q = query(
        collection(db, "news"),
        where("station", "==", stationName),
        orderBy("createdAt", "desc")
      );
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
      {/* 🌿 Curved Gradient Header */}
      <View style={styles.headerWrapper}>
        <Svg height="180" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path
            fill="url(#grad1)"
            d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z"
          />
        </Svg>

        <Svg height="265" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path
            fill="url(#grad2)"
            d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z"
          />
        </Svg>
        <Svg height="310" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path
            fill="url(#grad1)"
            d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z"
          />
        </Svg>
        {/* Header Text */}
        <View style={styles.headerContent}>
          
          <Text style={styles.title}>Station Dashboard</Text>
          <Text style={styles.subtitle}>Track Alerts and Driver Updates</Text>
        </View>
      </View>

      {/* 📰 News List */}
      <FlatList
        contentContainerStyle={{ paddingTop: 200, paddingBottom: 100 }}
        data={newsList}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.noDataText}>No news found</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.trainName}>{item.trainName}</Text>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.station}>Station: {item.station}</Text>
            <Text style={styles.news}>{item.news}</Text>
            <Text style={styles.date}>
              {item.createdAt?.toDate
                ? item.createdAt.toDate().toLocaleString()
                : item.createdAt}
            </Text>
          </View>
        )}
      />

      {/* 🧭 Footer Navigation */}
      <LinearGradient colors={["#fff", "#fff"]} style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("index")}
          style={styles.navButton}
        >
          <Entypo name="home" size={24} color="#004d00" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        
         <TouchableOpacity
          onPress={() => navigation.navigate("StationViewNews")}
          style={styles.navButton}
        >
          <Entypo name="news" size={24} color="#004d00" />
          <Text style={styles.footerTextActive}>News</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => navigation.navigate("StationMessage")}
          style={styles.navButton}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#004d00" />
          <Text style={styles.footerText}>Message</Text>
        </TouchableOpacity>

       

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.navButton}
        >
          <FontAwesome5 name="user-alt" size={24} color="#004d00" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // 🌿 Curved Header Styles
  headerWrapper: { position: "absolute", top: 0, width: "100%", alignItems: "center" },
  curve: { position: "absolute", top: 0 },
  headerContent: {
    position: "absolute",
    top: 80,
    width: "100%",
    alignItems: "center",
  },
  subtitle: { color: "#dff5df", fontSize: 16, textAlign: "center", marginTop: -5 },
  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -5,
  },

  // 📰 News List
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    marginHorizontal: 15,
  },
  trainName: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
  titleText: { fontWeight: "bold", fontSize: 18, marginBottom: 5, color: "#3080dbff" },
  station: { fontStyle: "italic", marginBottom: 5 },
  news: { marginBottom: 5 },
  date: { fontSize: 12, color: "#888" },
  noDataText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#888" },

  // 🧭 Footer
  footer: {
    position: "absolute",
    bottom:32,
    left: 15,
    right: 15,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2 },
});

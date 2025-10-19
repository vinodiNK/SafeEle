// app/WildLifeDashboard.jsx
import { Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as Animatable from "react-native-animatable";
import { db } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function WildLifeDashboard() {
  const navigation = useNavigation();
  const [locations, setLocations] = useState([]);
  const parallaxAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(parallaxAnim, {
          toValue: -15,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(parallaxAnim, {
          toValue: 15,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const q = query(collection(db, "elephant_locations"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const locs = [];
      querySnapshot.forEach((doc) => {
        locs.push({ id: doc.id, ...doc.data() });
      });
      setLocations(locs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <LinearGradient colors={["#006400", "#228B22"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Wildlife Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage & analyze elephant activity</Text>
        </View>
      </LinearGradient>

      {/* 🔹 Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Parallax image */}
        <View style={styles.topHalf}>
          
         
        </View>

        {/* 🔹 Cards Section */}
        <View style={styles.cardsContainer}>
          <Animatable.View animation="fadeInUp" delay={100} duration={800}>
            <TouchableOpacity
              onPress={() => navigation.navigate("CollisionZone")}
              activeOpacity={0.8}
            >
              <LinearGradient colors={["#56ab2f", "#a8e063"]} style={styles.card}>
                <MaterialCommunityIcons name="map-marker-alert" size={40} color="#fff" />
                <Text style={styles.cardTitle}>Past Collision Zones</Text>
                <Text style={styles.cardSubtitle}>
                  Historical elephant collision records
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={200} duration={800}>
            <TouchableOpacity
              onPress={() => navigation.navigate("GuestLocation")}
              activeOpacity={0.8}
            >
              <LinearGradient colors={["#f7971e", "#ffd200"]} style={styles.card}>
                <MaterialCommunityIcons name="account-group" size={40} color="#fff" />
                <Text style={styles.cardTitle}>Guest Locations</Text>
                <Text style={styles.cardSubtitle}>View locations updated by guests</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>

          
        </View>
      </ScrollView>

      {/* 🔹 Footer Navigation */}
      <LinearGradient colors={["#004d00", "#006400"]} style={styles.footer}>
        {/* Home */}
        <TouchableOpacity
          onPress={() => navigation.navigate("index")}
          style={styles.navButton}
        >
          <Entypo name="home" size={24} color="#c8e6c9" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        {/* Add Data */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AddCollision")}
          style={styles.navButton}
        >
          <MaterialCommunityIcons name="plus-circle" size={26} color="#c8e6c9" />
          <Text style={styles.footerText}>Add Data</Text>
        </TouchableOpacity>

        {/* Message */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Message")}
          style={styles.navButton}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#c8e6c9" />
          <Text style={styles.footerText}>Message</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          onPress={() => navigation.navigate("WildProfile")}
          style={styles.navButton}
        >
          <FontAwesome5 name="user-alt" size={20} color="#c8e6c9" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5fdf6" },
  header: {
    paddingVertical: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  headerContent: { alignItems: "center" },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  headerSubtitle: { color: "#e0f7e9", fontSize: 14, marginTop: 4 },

  scrollContainer: { paddingBottom: 100 },
  topHalf: {
    width: "100%",
    height: height * 0.35,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: { position: "absolute", top: 0, width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },

  cardsContainer: { paddingHorizontal: 15, marginTop: 20 },
  card: {
    padding: 35,
    borderRadius: 20,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 6 },
  cardSubtitle: { fontSize: 14, color: "#fff", marginTop: 5, textAlign: "center" },

  footer: {
    position: "absolute",
    bottom: 35,
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
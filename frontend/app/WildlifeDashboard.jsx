import { Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from "react-native-svg";
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
      {/* 🌿 Curved Green Header */}
      <View style={styles.headerWrapper}>
        <Svg height="220" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad1)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Svg height="300" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad2)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Svg height="155" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad3)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Wildlife Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage & analyze elephant activity</Text>
        </View>
      </View>

      {/* 🔹 Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardsContainer}>
          <Animatable.View animation="fadeInUp" delay={100} duration={800}>
            <TouchableOpacity
              onPress={() => navigation.navigate("CollisionZone")}
              activeOpacity={0.8}
            >
              <View style={[styles.card, { backgroundColor: "#4CAF50" }]}>
                <MaterialCommunityIcons name="map-marker-alert" size={40} color="#fff" />
                <Text style={styles.cardTitle}>Past Collision Zones</Text>
                <Text style={styles.cardSubtitle}>
                  Historical elephant collision records
                </Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={200} duration={800}>
            <TouchableOpacity
              onPress={() => navigation.navigate("GuestLocation")}
              activeOpacity={0.8}
            >
              <View style={[styles.card, { backgroundColor: "#f7971e" }]}>
                <MaterialCommunityIcons name="account-group" size={40} color="#fff" />
                <Text style={styles.cardTitle}>Guest Locations</Text>
                <Text style={styles.cardSubtitle}>View locations updated by guests</Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>

      {/* 🔹 Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("index")} style={styles.navButton}>
          <Entypo name="home" size={24} color="#004d00" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("AddCollision")} style={styles.navButton}>
          <MaterialCommunityIcons name="plus-circle" size={26} color="#004d00" />
          <Text style={styles.footerText}>Add Data</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Message")} style={styles.navButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#004d00" />
          <Text style={styles.footerText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("WildProfile")} style={styles.navButton}>
          <FontAwesome5 name="user-alt" size={20} color="#004d00" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5fdf6" },
  headerWrapper: { position: "relative", alignItems: "center", marginBottom: 30 },
  curve: { position: "absolute", top: 0, left: 0 },
  headerTextContainer: {
    position: "absolute",
    top: 80,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  headerSubtitle: { color: "#e0f7e9", fontSize: 14, marginTop: 4 },

  scrollContainer: { paddingBottom: 100 },
  cardsContainer: { paddingHorizontal: 5, marginTop: 180 },

  card: {
    padding: 55,
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
    backgroundColor: "#f5fbf5ff",
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2 },
});

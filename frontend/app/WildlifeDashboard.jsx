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

  // Parallax animation for icons
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(parallaxAnim, {
          toValue: -10,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(parallaxAnim, {
          toValue: 10,
          duration: 4000,
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
      {/* 🌿 Curved Gradient Header */}
      <View style={styles.headerWrapper}>
        <Svg height="250" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad1)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Svg height="170" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad1)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Svg height="320" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad1)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Wildlife Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage & analyze elephant activity</Text>
        </View>
      </View>

      {/* 🔹 Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardsContainer}>
          {/* Past Collision Zones */}
          <Animatable.View animation="fadeInUp" delay={100} duration={800}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("CollisionZone")}
            >
              <Animated.View style={[styles.card, styles.gradientCard]}>
                <Animated.View style={{ transform: [{ translateY: parallaxAnim }] }}>
                  <MaterialCommunityIcons name="map-marker-alert" size={50} color="#fff" />
                </Animated.View>
                <Text style={styles.cardTitle}>Past Collision Zones</Text>
                <Text style={styles.cardSubtitle}>
                  Historical elephant collision records
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </Animatable.View>

          {/* Guest Locations */}
          <Animatable.View animation="fadeInUp" delay={200} duration={800}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("GuestLocation")}
            >
              <Animated.View style={[styles.card, styles.gradientCardOrange]}>
                <Animated.View style={{ transform: [{ translateY: parallaxAnim }] }}>
                  <MaterialCommunityIcons name="account-group" size={50} color="#fff" />
                </Animated.View>
                <Text style={styles.cardTitle}>Guest Locations</Text>
                <Text style={styles.cardSubtitle}>View locations updated by guests</Text>
              </Animated.View>
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
  cardsContainer: { paddingHorizontal: 10, marginTop: 150 },

  card: {
    padding: 45,
    borderRadius: 25,
    marginVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 30,
    marginTop: 30,
  },
  gradientCard: {
    backgroundColor: "#4CAF50",
    shadowColor: "#1B5E20",
  },
  gradientCardOrange: {
    backgroundColor: "#f7971e",
    shadowColor: "#bf5700",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
    lineHeight: 18,
  },

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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2 },
});

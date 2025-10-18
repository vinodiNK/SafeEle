// app/WildLifeDashboard.jsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { db } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function WildLifeDashboard() {
  const navigation = useNavigation();
  const [locations, setLocations] = useState([]);

  // Animation refs
  const parallaxAnim = useRef(new Animated.Value(0)).current;

  // Parallax slow floating animation
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
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top section with parallax image */}
        <View style={styles.topHalf}>
          <Animated.Image
            source={require("../assets/wild.png")}
            style={[styles.image, { transform: [{ translateY: parallaxAnim }] }]}
            resizeMode="cover"
          />

          {/* Dark overlay to make text readable */}
          <View style={styles.overlay} />

          {/* Header Text */}
          
        </View>

        {/* Cards Section */}
        <View style={styles.cardsContainer}>
          {/* Past Collision Zones */}
          <Animatable.View animation="fadeInUp" delay={100} duration={800}>
            <TouchableOpacity onPress={() => navigation.navigate("CollisionZone")} activeOpacity={0.8}>
              <LinearGradient colors={["#56ab2f", "#a8e063"]} style={styles.card}>
                <MaterialCommunityIcons name="map-marker-alert" size={40} color="#fff" />
                <Text style={styles.cardTitle}>Past Collision Zones</Text>
                <Text style={styles.cardSubtitle}>Historical elephant collision records</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>

          {/* Guest Locations */}
          <Animatable.View animation="fadeInUp" delay={200} duration={800}>
            <TouchableOpacity onPress={() => navigation.navigate("GuestLocation")} activeOpacity={0.8}>
              <LinearGradient colors={["#f7971e", "#ffd200"]} style={styles.card}>
                <MaterialCommunityIcons name="account-group" size={40} color="#fff" />
                <Text style={styles.cardTitle}>Guest Locations</Text>
                <Text style={styles.cardSubtitle}>View locations updated by guests</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>

          {/* Add Collision Zone */}
          <Animatable.View animation="fadeInUp" delay={300} duration={800}>
            <TouchableOpacity onPress={() => navigation.navigate("AddCollision")} activeOpacity={0.8}>
              <LinearGradient colors={["#36d1dc", "#5b86e5"]} style={[styles.card, styles.primaryCard]}>
                <MaterialCommunityIcons name="plus-box" size={45} color="#fff" />
                <Text style={styles.cardTitle}>Add Collision Zone</Text>
                <Text style={styles.cardSubtitle}>Report new collision zone</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Animatable.View animation="fadeInUp" delay={400} duration={800}>
            <TouchableOpacity onPress={() => navigation.navigate("index")} activeOpacity={0.8}>
              <Animatable.View animation="pulse" iterationCount="infinite" easing="ease-in-out">
                <LinearGradient colors={["#2f803eff", "#1daf38ff"]} style={styles.footerButton}>
                  <MaterialCommunityIcons name="logout" size={28} color="#fff" />
                  <Text style={styles.footerButtonText}>Back to Login</Text>
                </LinearGradient>
              </Animatable.View>
            </TouchableOpacity>
          </Animatable.View>
          <Text style={styles.footerText}>Wildlife Conservation App</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  scrollContainer: { paddingBottom: 60 },
  topHalf: {
    width: "100%",
    height: height * 0.45,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)", // dark layer for contrast
  },
  headerContainer: { alignItems: "center", paddingHorizontal: 20 },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 1,
  },
  subHeader: { fontSize: 16, color: "#fff", textAlign: "center", marginTop: 6 },
  cardsContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
    zIndex: 5,
  },
  card: {
    padding: 45,
    borderRadius: 20,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
  },
  primaryCard: { transform: [{ scale: 1.05 }] },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 6 },
  cardSubtitle: { fontSize: 14, color: "#fff", marginTop: 5, textAlign: "center" },
  footerContainer: { alignItems: "center", marginTop: 15 },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  footerButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  footerText: { textAlign: "center", marginTop: 8, fontSize: 14, color: "#333" },
});

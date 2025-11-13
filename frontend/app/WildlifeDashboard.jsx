// app/WildLifeDashboard.jsx
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
  View
} from "react-native";

import * as Animatable from "react-native-animatable";
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from "react-native-svg";
import { db } from "../firebaseConfig";

const { width } = Dimensions.get("window");

export default function WildLifeDashboard() {
  const navigation = useNavigation();
  const [locations, setLocations] = useState([]);
  const parallaxAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current; // 🌊 image floating animation

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

  // Floating animation for image 🐘
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageAnim, {
          toValue: -10,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(imageAnim, {
          toValue: 10,
          duration: 2500,
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
    const q = query(collection(db, "collisionZones"), orderBy("timestamp", "desc"));
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
        <Svg height="90" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
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

        <Svg height="250" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad2)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Wildlife Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage & analyze elephant activity</Text>
        </View>
      </View>

      {/* 🐘 Animated Floating Image */}
      <Animated.Image
        source={require("../assets/wildlife.png")}
        style={[
          styles.headerImage,
          { transform: [{ translateY: imageAnim }] },
        ]}
      />

      {/* 🔹 Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardsContainer}>
          <View style={styles.rowContainer}>
            {/* 🗺️ Past Collision Zones */}
            <Animatable.View animation="fadeInUp" delay={100} duration={800}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("CollisionZone")}
              >
                <Animated.View style={[styles.smallCard, styles.gradientCard]}>
                  <Animated.View style={{ transform: [{ translateY: parallaxAnim }] }}>
                    
                  </Animated.View>
                  <View style={styles.cardContent}>
                    <Ionicons name="warning" size={42} color="#fff" style={styles.cardIcon} />
                    <Text style={styles.cardTitle}>Past Collision</Text>
                  </View>
                  <Text style={styles.cardSubtitle}>Historical collision records</Text>
                </Animated.View>
              </TouchableOpacity>
            </Animatable.View>

            {/* 👥 Guest Locations */}
           <Animatable.View animation="fadeInUp" delay={200} duration={800}>
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => navigation.navigate("GuestLocation")}
  >
    <Animated.View style={[styles.smallCard, styles.gradientCardOrange]}>
      <Animated.View style={{ transform: [{ translateY: parallaxAnim }] }}>
        <MaterialCommunityIcons name="map-marker-account" size={42} color="#fff" />
      </Animated.View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Guest Locations</Text>
      </View>
      <Text style={styles.cardSubtitle}>Updates shared by guests</Text>
    </Animated.View>
  </TouchableOpacity>
</Animatable.View>

          </View>
        </View>
      </ScrollView>

      {/* 🔹 Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("index")} style={styles.navButton}>
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

        <TouchableOpacity onPress={() => navigation.navigate("WildViewNews")} style={styles.navButton}>
          <Entypo name="news" size={24} color="#004d00" />
          <Text style={styles.footerText}>News</Text>
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
  headerTextContainer: { position: "absolute", top: 80, alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "bold", letterSpacing: 1,marginTop:-30 },
  headerSubtitle: { color: "#e0f7e9", fontSize: 14, marginTop: 4 },

  // 🐘 Animated Image
  headerImage: {
    width: "90%",
    height: 260,
    alignSelf: "center",
    marginTop: 170,
    borderRadius: 20,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },

  scrollContainer: { paddingBottom: 100 },
  cardsContainer: { paddingHorizontal: 10, marginTop: 150 },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },

  smallCard: {
    width: width * 0.44,
    height: 150,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginTop: -100,
    padding: 10,
  },
  gradientCard: { backgroundColor: "#2f8658ff", shadowColor: "#1B5E20" },
  gradientCardOrange: { backgroundColor: "#f7971e", shadowColor: "#bf5700" },

  cardContent: { alignItems: "center", justifyContent: "center", flexDirection: "column" },
  cardIcon: { marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", textAlign: "center" },
  cardSubtitle: { fontSize: 13, color: "#fff", marginTop: 5, textAlign: "center" },

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
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2,fontWeight: "bold" },
});

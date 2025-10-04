import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebaseConfig";

export default function WildLifeDashboard() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, "elephant_locations"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const locs = [];
      querySnapshot.forEach((doc) => {
        locs.push({ id: doc.id, ...doc.data() });
      });
      setLocations(locs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/wildlifebg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}> Wildlife </Text>
          <Text style={styles.header}>  Dashboard</Text>
          <Text style={styles.subHeader}>Monitor and Manage Elephant Data</Text>

          <View style={styles.cardsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("CollisionZone")}>
              <LinearGradient colors={["#34ace0", "#33d9b2"]} style={styles.card}>
                <MaterialCommunityIcons name="map-marker-alert" size={40} color="#fff" />
                <Text style={styles.cardTitle}>Past Collision Zones</Text>
                <Text style={styles.cardSubtitle}>
                  Historical elephant collision records
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("GuestLocation")}>
              <LinearGradient colors={["#ff793f", "#ffb142"]} style={styles.card}>
                <MaterialCommunityIcons name="account-group" size={40} color="#fff" />
                <Text style={styles.cardTitle}>Guest Locations</Text>
                <Text style={styles.cardSubtitle}>
                  View locations updated by guests
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("AddCollision")}>
              <LinearGradient colors={["#70a1ff", "#5352ed"]} style={styles.card}>
                <MaterialCommunityIcons name="plus-box" size={40} color="#fff" />
                <Text style={styles.cardTitle}>Add Collision Zone</Text>
                <Text style={styles.cardSubtitle}>Report new collision zone</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ✅ Moved Back button closer to footer */}
          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("index")}>
              <LinearGradient colors={["#38ff59", "#6bff70"]} style={styles.smallCard}>
                <MaterialCommunityIcons name="logout" size={28} color="#fff" />
                <Text style={styles.cardTitle}>Back to Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.footerText}>Wildlife Conservation App</Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" },
  scrollContainer: { padding: 15 },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#fff",
    letterSpacing: 1,
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 85,
    color: "#dcdde1",
  },
  cardsContainer: {
    marginBottom: 20, // reduced gap before footer section
  },
  card: {
    padding: 60,
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 20, // smaller spacing to bring closer
  },
smallCard: {
  paddingVertical: 5,
  paddingHorizontal: 20,
  borderRadius: 30,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 6,
  width: 360,        // ✅ Increased width from 180 → 260
  alignSelf: "center", // ✅ Keeps button centered on screen
},

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#f0f0f0",
    marginTop: 5,
    textAlign: "center",
  },
  footerText: {
  textAlign: "center",
  marginTop: 20,
  fontSize: 14,
  color: "#dcdde1",
  width: "100%",       // ✅ makes text span full width of container
},

});

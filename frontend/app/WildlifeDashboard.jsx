import { MaterialCommunityIcons } from "@expo/vector-icons"; // ✅ icons
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient"; // ✅ gradient support
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🐘 Wildlife Dashboard</Text>
      <Text style={styles.subHeader}>Monitor and Manage Elephant Data</Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("CollisionZone")}>
          <LinearGradient
            colors={['#34ace0', '#33d9b2']}
            style={styles.card}
          >
            <MaterialCommunityIcons name="map-marker-alert" size={40} color="#fff" />
            <Text style={styles.cardTitle}>Past Collision Zones</Text>
            <Text style={styles.cardSubtitle}>Historical elephant collision records</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("GuestLocation")}>
          <LinearGradient
            colors={['#ff793f', '#ffb142']}
            style={styles.card}
          >
            <MaterialCommunityIcons name="account-group" size={40} color="#fff" />
            <Text style={styles.cardTitle}>Guest Locations</Text>
            <Text style={styles.cardSubtitle}>View locations updated by guests</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("AddCollision")}>
          <LinearGradient
            colors={['#70a1ff', '#5352ed']}
            style={styles.card}
          >
            <MaterialCommunityIcons name="plus-box" size={40} color="#fff" />
            <Text style={styles.cardTitle}>Add Collision Zone</Text>
            <Text style={styles.cardSubtitle}>Report new collision zone</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("index")}>
          <LinearGradient
            colors={['#38ff7eff', '#20ae13ff']}
            style={styles.card}
          >
            <MaterialCommunityIcons name="logout" size={40} color="#fff" />
            <Text style={styles.cardTitle}>Back to Login</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>Wildlife Conservation App</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 15 },
  header: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginVertical: 10, color: "#2f3542" },
  subHeader: { fontSize: 16, textAlign: "center", marginBottom: 20, color: "#57606f" },
  cardsContainer: { marginBottom: 30 },
  card: {
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 10 },
  cardSubtitle: { fontSize: 14, color: "#f0f0f0", marginTop: 5, textAlign: "center" },
  footerText: { textAlign: "center", marginTop: 30, fontSize: 14, color: "#aaa" },
});

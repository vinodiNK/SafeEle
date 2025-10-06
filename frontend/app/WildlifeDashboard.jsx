import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { db } from "../firebaseConfig";

const { width } = Dimensions.get("window");

export default function WildLifeDashboard() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const q = query(
      collection(db, "elephant_locations"),
      orderBy("timestamp", "desc")
    );
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
          {/* Header */}
          <Text style={styles.headerTitle}>Wildlife Dashboard</Text>
          <Text style={styles.subHeader}>Monitor and Manage Elephant Data</Text>

          {/* Cards */}
          <View style={styles.cardsContainer}>
            {/* Past Collision Zones */}
            <Animatable.View animation="fadeInUp" delay={100} duration={800}>
              <TouchableOpacity
                onPress={() => navigation.navigate("CollisionZone")}
                activeOpacity={0.8}
              >
                <Animatable.View animation="bounceIn" delay={200} duration={1000}>
                  <LinearGradient
                    colors={["#34ace0", "#33d9b2"]}
                    style={styles.card}
                  >
                    <MaterialCommunityIcons
                      name="map-marker-alert"
                      size={40}
                      color="#fff"
                    />
                    <Text style={styles.cardTitle}>Past Collision Zones</Text>
                    <Text style={styles.cardSubtitle}>
                      Historical elephant collision records
                    </Text>
                  </LinearGradient>
                </Animatable.View>
              </TouchableOpacity>
            </Animatable.View>

            {/* Guest Locations */}
            <Animatable.View animation="fadeInUp" delay={200} duration={800}>
              <TouchableOpacity
                onPress={() => navigation.navigate("GuestLocation")}
                activeOpacity={0.8}
              >
                <Animatable.View animation="bounceIn" delay={300} duration={1000}>
                  <LinearGradient
                    colors={["#ff793f", "#ffb142"]}
                    style={styles.card}
                  >
                    <MaterialCommunityIcons
                      name="account-group"
                      size={40}
                      color="#fff"
                    />
                    <Text style={styles.cardTitle}>Guest Locations</Text>
                    <Text style={styles.cardSubtitle}>
                      View locations updated by guests
                    </Text>
                  </LinearGradient>
                </Animatable.View>
              </TouchableOpacity>
            </Animatable.View>

            {/* Add Collision Zone - Primary Action */}
            <Animatable.View animation="fadeInUp" delay={300} duration={800}>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddCollision")}
                activeOpacity={0.8}
              >
                <Animatable.View animation="bounceIn" delay={400} duration={1000}>
                  <LinearGradient
                    colors={["#70a1ff", "#5352ed"]}
                    style={[styles.card, styles.primaryCard]}
                  >
                    <MaterialCommunityIcons
                      name="plus-box"
                      size={45}
                      color="#fff"
                    />
                    <Text style={styles.cardTitle}>Add Collision Zone</Text>
                    <Text style={styles.cardSubtitle}>
                      Report new collision zone
                    </Text>
                  </LinearGradient>
                </Animatable.View>
              </TouchableOpacity>
            </Animatable.View>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Animatable.View animation="fadeInUp" delay={500} duration={800}>
              <TouchableOpacity
                onPress={() => navigation.navigate("index")}
                activeOpacity={0.8}
              >
                <Animatable.View animation="pulse" iterationCount="infinite" easing="ease-in-out">
                  <LinearGradient
                    colors={["#38ff59", "#6bff70"]}
                    style={styles.footerButton}
                  >
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" },
  scrollContainer: { padding: 15, paddingBottom: 40 },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    color: "#d9e4deff",
    letterSpacing: 1,
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#dcdde1",
  },
  cardsContainer: {
    marginBottom: 20,
  },
  card: {
    padding: 50,
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
  },
  primaryCard: {
    transform: [{ scale: 1.05 }],
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
  footerContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -5,
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footerText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#dcdde1",
  },
});

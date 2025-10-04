// app/DriverDashboard.jsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TrainImage from "../assets/train.png";

export default function DriverDashboard() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.role}>Engine Driver</Text>
        <Image source={TrainImage} style={styles.trainImage} resizeMode="contain" />
      </View>

      {/* Middle Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("OpenMap")}
        >
          <Ionicons name="map" size={28} color="#2d6a4f" />
          <Text style={styles.cardText}>Open Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("SendNews")}
        >
          <Ionicons name="chatbubbles" size={28} color="#2d6a4f" />
          <Text style={styles.cardText}>Send News</Text>
        </TouchableOpacity>
      </View>

      {/* Back to Login Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topSection: {
    backgroundColor: "#f2f8f5ff",
    padding: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
  },
  welcome: { color: "#000", fontSize: 16 },
  role: { color: "#000", fontSize: 22, fontWeight: "bold", marginTop: 4 },
  trainImage: { 
    width: "115%", 
    height: 450, 
    marginTop: -90, 
    resizeMode: "cover" 
  },

  buttonContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: -93,
  },
  card: {
    width: "80%",
    backgroundColor: "#e9f5ee",
    borderRadius: 30,
    padding: 35,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: { marginTop: 8, fontSize: 26, color: "#2d6a4f", fontWeight: "500" },

  // ✅ Back Button
  backButton: {
    position: "absolute",
    bottom: 30,
    left: "10%",
    right: "10%",
    paddingVertical: 15,
    backgroundColor: "#166826ff",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

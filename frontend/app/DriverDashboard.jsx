// app/DriverDashboard.jsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // ✅ import hook
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TrainImage from "../assets/train.png"; // use your train illustration image

export default function DriverDashboard() {
  const navigation = useNavigation(); // ✅ get navigation reliably

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
          onPress={() => navigation.navigate("OpenMap")} // ✅ now works
        >
          <Ionicons name="map" size={28} color="#2d6a4f" />
          <Text style={styles.cardText}>Open Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("DriverNews")}
        >
          <Ionicons name="chatbubbles" size={28} color="#2d6a4f" />
          <Text style={styles.cardText}>Send News</Text>
        </TouchableOpacity>
      </View>
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
  welcome: { color: "#000", fontSize: 16 }, // changed to visible color
  role: { color: "#000", fontSize: 22, fontWeight: "bold", marginTop: 4 }, // changed to visible color
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
});

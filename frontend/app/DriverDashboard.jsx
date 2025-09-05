// app/DriverDashboard.jsx
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TrainImage from "../assets/train.png"; // use your train illustration image

export default function DriverDashboard({ navigation }) {
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
          onPress={() => navigation.navigate("DriverMap")}
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="#2d6a4f" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings" size={24} color="#2d6a4f" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="help-circle" size={24} color="#2d6a4f" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={24} color="#2d6a4f" />
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
  welcome: { color: "#fff", fontSize: 16 },
  role: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 4 },
  trainImage: { width: 200, height: 120, marginTop: 20 },

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

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
});

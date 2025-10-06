// app/StationDashboard.jsx
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SplashImage from "../assets/login.jpg"; // Add your background image here

export default function StationDashboard() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ImageBackground source={SplashImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Station Master Dashboard</Text>

          {/* View News Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("StationViewNews")}
          >
            <Text style={styles.buttonText}>View News</Text>
          </TouchableOpacity>

          {/* Send News Button */}
          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={() => navigation.navigate("StationSendNews")}
          >
            <Text style={styles.buttonText}>Send News</Text>
          </TouchableOpacity>

          {/* Back to Login Button */}
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.navigate("index")}
          >
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', // dark overlay to improve readability
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#2e8b57",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sendButton: {
    backgroundColor: "#28a745", // Different color for Send News
  },
  backButton: {
    backgroundColor: "#555", // Slightly muted color for Back button
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

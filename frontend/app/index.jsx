import { useNavigation } from "@react-navigation/native";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SplashImage from "../assets/home.png";

export default function Index() {
  const navigation = useNavigation();

  return (
    <ImageBackground source={SplashImage} style={styles.background}>
      <View style={styles.header}>
        <Text style={styles.title}>SAFE ELE</Text>
        <Text style={styles.subtitle}>Making Your Experience Safer & Smarter</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.guestButton}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 55,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 58,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  guestButton: {
    width: "73%",
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    marginBottom: 10,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  loginButton: {
    width: "73%",
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#28a745",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

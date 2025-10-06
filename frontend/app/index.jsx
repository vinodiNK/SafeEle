import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import SplashImage from "../assets/home.png";

export default function Index() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ImageBackground source={SplashImage} style={styles.background}>
      {/* Header Section with Animated Title */}
      <View style={styles.header}>
        <Animatable.Text
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          duration={2000}
          style={styles.title}
        >
          SAFE ELE
        </Animatable.Text>

        <Animatable.Text
          animation="fadeIn"
          delay={400}
          duration={1500}
          style={styles.subtitle}
        >
          Making Your Experience Safer & Smarter
        </Animatable.Text>
      </View>

      {/* Button Section */}
      <Animatable.View
        animation="fadeInUp"
        delay={800}
        duration={1500}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => navigation.navigate("UploadLocation")}
        >
          <Animatable.Text
            animation="fadeIn"
            delay={1000}
            style={styles.guestButtonText}
          >
            Continue as Guest
          </Animatable.Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Animatable.Text
            animation="fadeIn"
            delay={1200}
            style={styles.loginButtonText}
          >
            Login
          </Animatable.Text>
        </TouchableOpacity>
      </Animatable.View>
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

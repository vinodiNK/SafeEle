import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useLayoutEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import ElephantImage from "../assets/guestImg.png"; // 🐘 your elephant image

export default function GuestHome() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* 🌿 Curved Header with animation */}
      <View style={styles.headerWrapper}>
        <Svg height="220" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Svg height="170" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>
        <Svg height="300" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>


        <Animatable.Text
          animation="fadeInDown"
          delay={200}
          duration={1000}
          style={styles.headerText}
        >
          Hi Guest 
        </Animatable.Text>

        {/* 🖐️ Waving hand animation */}
        <LottieView
          source={require("../assets/handwave.json")} // 👋 Add Lottie JSON in assets
          autoPlay
          loop
          style={styles.handWave}
        />
      </View>

      {/* 🐘 Floating Elephant Animation */}
      <Animatable.View animation="pulse" iterationCount="infinite" easing="ease-in-out" duration={2500}>
        <Image source={ElephantImage} style={styles.elephantImage} resizeMode="contain" />
      </Animatable.View>

      {/* 📢 Awareness Message */}
      <Animatable.View animation="fadeInUp" delay={400} duration={1000} style={styles.messageBox}>
        <Text style={styles.messageText}>
          If you see an <Text style={styles.highlight}>elephant near a railway track</Text>, you can
          report it here by updating the location.
        </Text>
      </Animatable.View>

      {/* 🚨 Action Button */}
      <Animatable.View animation="fadeInUp" delay={700} duration={800}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("UploadLocation")}
        >
          <Text style={styles.buttonText}>   Continue ➜   </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8f4",
    alignItems: "center",
  },
  headerWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  curve: {
    position: "absolute",
    top: 0,
  },
  headerText: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "bold",
    marginTop: 80,
  },
  handWave: {
    width: 70,
    height: 70,
    position: "absolute",
    right: 50,
    top: 70,
  },
  elephantImage: {
    width: 360,
    height: 360,
    marginVertical: 15,
  },
  messageBox: {
  backgroundColor: "#e8f5e9",
  margin: 20,
  padding: 25,
  borderRadius: 25,
  borderLeftWidth: 5,
  borderLeftColor: "#4CAF50",
  alignItems: "flex-start", // 👈 left align content
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 4,
  marginTop: -30,
},
messageText: {
  fontSize: 18,
  color: "#333",
  textAlign: "left", // 👈 left align text
  lineHeight: 26,
},
  highlight: {
    color: "#2e7d32",
    fontWeight: "bold",
    
  },
  button: {
  backgroundColor: "#4CAF50",
  paddingVertical: 20, // 🔼 Increased height
  marginHorizontal: 60, // 🔼 Slightly wider
  borderRadius: 25,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 6,
  width: "90%", // ✅ makes it larger and consistent on all screens
  alignSelf: "center",
},

buttonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 22, // 🔼 bigger text
  letterSpacing: 1,
},

});

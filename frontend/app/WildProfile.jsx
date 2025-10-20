// app/WildProfile.jsx
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLayoutEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from "react-native-svg";

export default function WildProfile() {
  const navigation = useNavigation();

  // 👇 Hide default navigation header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* 🌿 Curved Gradient Header */}
      <View style={styles.headerWrapper}>
        <Svg
                  height="170"
                  width="100%"
                  viewBox="0 0 1440 320"
                  style={styles.curve}
                >
                  <Defs>
                    <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#4CAF50" />
                      <Stop offset="100%" stopColor="#006400" />
                    </SvgGradient>
                  </Defs>
                  <Path
                    fill="url(#grad)"
                    d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z"
                  />
                </Svg>
                <Svg
                  height="220"
                  width="100%"
                  viewBox="0 0 1440 320"
                  style={styles.curve}
                >
                  <Defs>
                    <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#4CAF50" />
                      <Stop offset="100%" stopColor="#006400" />
                    </SvgGradient>
                  </Defs>
                  <Path
                    fill="url(#grad)"
                    d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z"
                  />
                </Svg>
                <Svg
                  height="300"
                  width="100%"
                  viewBox="0 0 1440 320"
                  style={styles.curve}
                >
                  <Defs>
                    <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#4CAF50" />
                      <Stop offset="100%" stopColor="#006400" />
                    </SvgGradient>
                  </Defs>
                  <Path
                    fill="url(#grad)"
                    d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z"
                  />
                </Svg>
       
        <Text style={styles.headerTitle}>Wildlife Profile</Text>
      </View>

      {/* Profile Content */}
      <View style={styles.content}>
        <Text style={styles.profileText}>profile</Text>
      </View>

      {/* 🌿 Footer Navigation */}
      <LinearGradient colors={["#eaf1eaff", "#f0f8f0ff"]} style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("WildlifeDashboard")} style={styles.navButton}>
          <Entypo name="home" size={24} color="#004d00" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Message")} style={styles.navButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#004d00" />
          <Text style={styles.footerText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("StationViewNews")} style={styles.navButton}>
          <Entypo name="news" size={24} color="#004d00" />
          <Text style={styles.footerText}>News</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("WildProfile")} style={styles.navButton}>
          <FontAwesome5 name="user-alt" size={24} color="#004d00" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingBottom: 90 },
  headerWrapper: { alignItems: "center", justifyContent: "center", marginBottom: 10 },
  curve: { position: "absolute", top: 0 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 100,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  profileText: { fontSize: 20, color: "#2E8B57" },
   footer: {
    position: "absolute",
    bottom: 35,
    left: 10,
    right: 10,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2 },
});

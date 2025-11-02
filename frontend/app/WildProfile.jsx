// app/WildProfile.jsx
import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLayoutEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from "react-native-svg";

export default function WildProfile() {
  const navigation = useNavigation();

  // Hide default top navigation header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* 🌿 Curved Green Header */}
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
       
        <Text style={styles.headerTitle}>Sation Master Profile</Text>
      </View>

      {/* 👤 Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeZ6_2H3Fz2ktHaHIFfQAOLuVwfGWp98G2Dg&s"
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>A.G.Jayalath</Text>
        <Text style={styles.profileRole}>Station Master</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="id-card-outline" size={22} color="#2E8B57" />
            <Text style={styles.infoText}>196011197845</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={22} color="#2E8B57" />
            <Text style={styles.infoText}>+94 70 123 4567</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={22} color="#2E8B57" />
            <Text style={styles.infoText}>jayalath@gmail.com</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={22} color="#2E8B57" />
            <Text style={styles.infoText}>Borupana, Ratmalana</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("index")}
        >
          <LinearGradient colors={["#32CD32", "#228B22"]} style={styles.logoutGradient}>
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 🌿 Footer Navigation */}
      <LinearGradient colors={["#eaf1eaff", "#e5ece5ff"]} style={styles.footer}>
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
  headerWrapper: { alignItems: "center", justifyContent: "center" },
  curve: { position: "absolute", top: 0 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 100,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 25,
    elevation: 3,
    marginTop: 60,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#2E8B57",
  },
  profileName: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: "#2E8B57" },
  profileRole: { fontSize: 16, color: "#666", marginBottom: 15 },

  infoContainer: { width: "85%", marginTop: 10 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  infoText: { fontSize: 16, color: "#333", marginLeft: 10 },

  logoutButton: { width: "70%", marginTop: 25 },
  logoutGradient: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2 },
});

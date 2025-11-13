// app/DriverProfile.jsx
import {
  FontAwesome5
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";
import { auth, db } from "../firebaseConfig";

export default function DriverProfile() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigation.navigate("index");
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No user data found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text style={{ color: "#2E8B57", marginTop: 10 }}>Loading Profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <Text style={{ color: "red" }}>No profile data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🚂 Curved Green Header */}
      <View style={styles.headerWrapper}>
        <Svg height="90" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Svg height="170" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Svg height="250" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Text style={styles.headerTitle}>Driver Profile</Text>
      </View>

      {/* 👤 Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: "https://bussiness-app.s3.ap-south-1.amazonaws.com/images/users/user_pics/24960/original/1.png",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileRole}>Engine Driver</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.emoji}>🪪 : </Text>
    <Text style={styles.infoText}>{userData.nic}</Text>
          </View>

          <View style={styles.infoRow}>
                       <Text style={styles.emoji}>📞 : </Text>
    <Text style={styles.infoText}>{userData.phone}</Text>
                    </View>

         <View style={styles.infoRow}>
                     <Text style={styles.emoji}>📧 : </Text>
    <Text style={styles.infoText}>{userData.email}</Text>
                   </View>
                   <View style={styles.infoRow}>
                    <Text style={styles.emoji}>📍 : </Text>
    <Text style={styles.infoText}>{userData.location}</Text>
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

      {/* 🧭 Footer Navigation */}
      <View style={styles.footer}>
       <TouchableOpacity
         onPress={() => navigation.navigate("index")}
         style={styles.navButton}
       >
         <FontAwesome5 name="home" size={24} color="#004d00" />
         <Text style={styles.footerText}>Home</Text>
       </TouchableOpacity>
<TouchableOpacity
  onPress={() => navigation.navigate("OpenMap")}
  style={styles.navButton}
>
  <FontAwesome5 name="map-marked-alt" size={24} color="#004d00" />
  <Text style={styles.footerText}>Map</Text>
</TouchableOpacity>

       <TouchableOpacity
         onPress={() => navigation.navigate("SendNews")}
         style={styles.navButton}
       >
         <FontAwesome5 name="envelope" size={22} color="#004d00" />
         <Text style={styles.footerText}>Message</Text>
       </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("DriverProfile")} style={styles.navButton}>
          <FontAwesome5 name="user-alt" size={24} color="#004d00" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingBottom: 90 },
  headerWrapper: { alignItems: "center", justifyContent: "center" },
  curve: { position: "absolute", top: 0 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 80,
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
    marginTop: 80,
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
  infoRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  infoText: { fontSize: 16, color: "#333", marginLeft: 10 },
  logoutButton: { width: "70%", marginTop: 25 },
  logoutGradient: { paddingVertical: 12, borderRadius: 25, alignItems: "center" },
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
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2,fontWeight: "bold" },

  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  emoji: {
    fontSize: 22,
    marginRight: 8,
  },
  infoText: {
    color: "#333",
    fontSize: 18,
  },
});

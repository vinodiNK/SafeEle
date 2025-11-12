// app/OpenMap.jsx
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from "react-native-svg";
import { db } from "../firebaseConfig";

const COLLISION_RADIUS = 1000; // meters

export default function OpenMap() {
  const [location, setLocation] = useState(null);
  const [elephantLocations, setElephantLocations] = useState([]);
  const [guestLocations, setGuestLocations] = useState([]);
  const [cameraLocations, setCameraLocations] = useState([]);
  const lastCollisionAlertRef = useRef({});
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Get driver location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (locUpdate) => setLocation(locUpdate.coords)
      );
    })();
  }, []);

  // Fetch elephant locations
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "collisionZones"), (snapshot) => {
      const locations = snapshot.docs.map((doc) => doc.data());
      setElephantLocations(locations);
    });
    return unsubscribe;
  }, []);

  // Fetch guest locations
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "guestLocations"), (snapshot) => {
      const locations = snapshot.docs.map((doc) => doc.data());
      setGuestLocations(locations);
    });
    return unsubscribe;
  }, []);

  // Fetch camera detections + alert driver
  
  // Collision alert real-time
  // 🚨 Collision alert for nearby elephant zones
useEffect(() => {
  if (!location || elephantLocations.length === 0) return;

  elephantLocations.forEach((zone, index) => {
    // Skip if data is missing
    if (!zone.latitude || !zone.longitude) return;

    const distance = getDistance(location, zone);
    const lastAlert = lastCollisionAlertRef.current[zone.id || index] || 0;
    const now = Date.now();

    // Alert if driver is within radius (1km = 1000m)
    if (distance <= COLLISION_RADIUS && now - lastAlert > 10000) {
      lastCollisionAlertRef.current[zone.id || index] = now;

      Alert.alert(
  "⚠️ Danger Ahead!",
  `Elephant collision zone detected nearby within ${Math.floor(distance)} meters.  

Please slow down and stay cautious! 🚆`,
  [{ text: "Ok", style: "destructive" }]
);
    }
  });
}, [location, elephantLocations]);


  // Distance calculator (Haversine)
  const getDistance = (loc1, loc2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (!location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2d6a4f" />
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
     <View style={styles.container}>
          {/* 🌿 Header */}
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
            <Svg height="240" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
              <Defs>
                <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#4CAF50" />
                  <Stop offset="100%" stopColor="#006400" />
                </SvgGradient>
              </Defs>
              <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
            </Svg>
        {/* Header Text */}
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            
          </View>
          <Text style={styles.subtitle}>Real-Time Elephant Monitoring</Text>
          
        </View>
      </View>

      {/* 🗺️ Map Section */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Driver location */}
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title="You are here"
          pinColor="#2d6a4f"
        />

        {/* Elephant locations */}
        {elephantLocations.map((ele, index) => (
          <Marker
            key={`elephant-${index}`}
            coordinate={{ latitude: ele.latitude, longitude: ele.longitude }}
            title="Elephant Location"
          >
            <Image
              source={require("../assets/elephant.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {/* Guest locations */}
        {guestLocations.map((guest, index) => (
          <Marker
            key={`guest-${index}`}
            coordinate={{ latitude: guest.latitude, longitude: guest.longitude }}
            title="Guest Location"
          >
            <Image
              source={require("../assets/elephant.png")}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {/* Camera detections */}
        
          
       
      </MapView>

      {/* 🧭 Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("index")} style={styles.navButton}>
          <Entypo name="home" size={22} color="#004d00" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("OpenMap")} style={styles.navButton}>
          <Entypo name="location-pin" size={26} color="#004d00" />
          <Text style={styles.footerText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SendNews")} style={styles.navButton}>
          <MaterialIcons name="message" size={22} color="#004d00" />
          <Text style={styles.footerText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("DriverProfile")} style={styles.navButton}>
          <FontAwesome5 name="user-alt" size={20} color="#004d00" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5e9" },

  // Curved Header
  headerWrapper: { position: "relative", alignItems: "center" },
  curve: { position: "absolute", top: 0 },
  headerContent: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  headerTextLeft: { color: "#e0f7e9", fontSize: 14, fontWeight: "bold" },
  headerTextRight: { color: "#e0f7e9", fontSize: 14, fontWeight: "bold" },
  subtitle: { color: "#dff5df", fontSize: 28, textAlign: "center", marginTop: 10,fontWeight: "bold" },


  map: { flex: 1, marginBottom: 90, marginTop: 180 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2, fontWeight: "bold" },
});

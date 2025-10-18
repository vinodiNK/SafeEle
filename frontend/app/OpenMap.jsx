// app/OpenMap.jsx
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
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
    const unsubscribe = onSnapshot(collection(db, "elephant_locations"), (snapshot) => {
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
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cameraLocation"), (snapshot) => {
      const locations = snapshot.docs.map((doc) => doc.data());
      setCameraLocations(locations);

      if (locations.length > 0) {
        const latest = locations.sort((a, b) => b.dateTime.seconds - a.dateTime.seconds)[0];

        if (latest && latest.dateTime?.seconds !== lastCollisionAlertRef.current["camera"]) {
          lastCollisionAlertRef.current["camera"] = latest.dateTime.seconds;

          Alert.alert(
            "🐘 Real-Time Elephant Detection",
            `📍 Location: ${latest.locationName}\n🕒 Time: ${new Date(
              latest.dateTime.seconds * 1000
            ).toLocaleString()}`,
            [{ text: "OK" }]
          );
        }
      }
    });

    return unsubscribe;
  }, []);

  // Collision alert real-time
  useEffect(() => {
    if (!location) return;
    elephantLocations.forEach((ele, idx) => {
      const distance = getDistance(location, ele);
      const lastAlert = lastCollisionAlertRef.current[ele.id] || 0;
      const now = Date.now();
      if (distance <= COLLISION_RADIUS && now - lastAlert > 10000) {
        lastCollisionAlertRef.current[ele.id] = now;

        Alert.alert(
          "⚠️ Collision Warning!",
          `Elephant detected within ${Math.floor(distance)} meters!`,
          [{ text: "OK" }]
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
      {/* 🔹 Header */}
      <LinearGradient colors={["#006400", "#228B22"]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTextLeft}>Train ID: 1234</Text>
          <Text style={styles.headerTextRight}>Lakshman</Text>
        </View>
        <Text style={styles.subtitle}>Real-Time Monitoring</Text>
        <Text style={styles.title}>Live Map</Text>
      </LinearGradient>

      {/* 🔹 Map Section */}
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
            description="Reported in Firestore"
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
            description="Reported in Firestore"
          >
            <Image
              source={require("../assets/elephant.png")}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {/* Camera detections */}
        {cameraLocations.map((cam, index) => (
          <Marker
            key={`camera-${index}`}
            coordinate={{ latitude: cam.latitude, longitude: cam.longitude }}
            title={`Camera: ${cam.cameraId}`}
            description={`${cam.locationName} - ${new Date(
              cam.dateTime?.seconds * 1000
            ).toLocaleString()}`}
          >
            <Image
              source={require("../assets/elephantRed.png")}
              style={{ width: 45, height: 45 }}
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>

      {/* 🔹 Footer Navigation */}
      <LinearGradient colors={["#004d00", "#006400"]} style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("index")}
          style={styles.navButton}
        >
          <Entypo name="home" size={22} color="#c8e6c9" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("OpenMap")}
          style={styles.navButton}
        >
          <Entypo name="location-pin" size={26} color="white" />
          <Text style={styles.footerTextActive}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SendNews")}
          style={styles.navButton}
        >
          <MaterialIcons name="message" size={22} color="#fff" />
          <Text style={styles.footerText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.navButton}
        >
          <FontAwesome5 name="user-alt" size={20} color="#c8e6c9" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5e9" },

  header: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 5,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTextLeft: { color: "#e0f7e9", fontSize: 14, fontWeight: "bold" },
  headerTextRight: { color: "#e0f7e9", fontSize: 14, fontWeight: "bold" },
  subtitle: { color: "#dff5df", fontSize: 16, textAlign: "center", marginTop: 10 },
  title: { color: "white", fontSize: 34, fontWeight: "bold", textAlign: "center" },

  map: { flex: 1, marginBottom: 70 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "90%",
    alignSelf: "center",
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 35,
    elevation: 10,
  },
  navButton: { alignItems: "center" },
  footerText: { color: "#c8e6c9", fontSize: 12, marginTop: 2 },
  footerTextActive: { color: "white", fontSize: 12, fontWeight: "bold", marginTop: 2 },
});

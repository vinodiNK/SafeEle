import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
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
import ElephantIcon from "../assets/elephant.png";
import { db } from "../firebaseConfig";

export default function UploadLocation() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need location access to show map.");
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      let reverseGeocode = await Location.reverseGeocodeAsync(currentLocation.coords);
      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        const parts = [place.street, place.city, place.region, place.country].filter(Boolean);
        setLocationName(parts.join(", "));
      }

      setLoading(false);
    })();
  }, []);

  const handleUpload = async () => {
    if (!location) return;

    try {
      await addDoc(collection(db, "guestLocations"), {
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: locationName || "Unknown Location",
        timestamp: Timestamp.now(),
      });
      Alert.alert("Success", "Location updated successfully!");
    } catch (error) {
      console.error("Error uploading location:", error);
      Alert.alert("Error", "Failed to upload location.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🌿 Curved Green Header */}
      <View style={styles.headerWrapper}>
        <Svg height="170" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        <Svg height="220" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad2)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>

        

        <Text style={styles.headerTitle}>Guest Location Update</Text>
        
      </View>

      

      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Elephant Location"
            description={locationName}
          >
            <Image source={ElephantIcon} style={{ width: 40, height: 40 }} />
          </Marker>
        </MapView>
      ) : (
        <Text>No location available</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>Update Location</Text>
        
      </TouchableOpacity>
      <Text style={styles.subtitle}>If you see an elephant near a railway track, you can report it here by updating the location.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  // 🌿 Curved Header Styles
  headerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -40,
  },
  curve: {
    position: "absolute",
    top: 0,
  },
  headerTitle: {
    position: "absolute",
    top: 60,
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

   subtitle: {
    color: "#071307ff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 45,
     fontWeight: "bold",
  },

  infoBox: {
    backgroundColor: "#e8f5e9",
    margin: 15,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#28a745",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    lineHeight: 30,
  },
  map: { flex: 1, borderRadius: 15, marginHorizontal: 10, marginBottom: 10, marginTop: 170 },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    margin: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

// app/CollisionZone.jsx
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";
import { db } from "../firebaseConfig";

export default function CollisionZone() {
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elephantLocations, setElephantLocations] = useState([]);
  const [editId, setEditId] = useState(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Fetch locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "elephant_locations"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const locations = [];
      querySnapshot.forEach((doc) =>
        locations.push({ id: doc.id, ...doc.data() })
      );
      setElephantLocations(locations);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Save or update location
  const saveLocation = async () => {
    if (!locationName || !latitude || !longitude || !date || !time) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      let [timePart, meridiem] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      const timestamp = new Date(date);
      timestamp.setHours(hours, minutes, 0, 0);

      if (editId) {
        const docRef = doc(db, "elephant_locations", editId);
        await updateDoc(docRef, {
          locationName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timestamp,
        });
        Alert.alert(
          "✅ Updated",
          `Location "${locationName}" updated successfully.`
        );
        setEditId(null);
      } else {
        await addDoc(collection(db, "elephant_locations"), {
          locationName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timestamp,
          createdAt: serverTimestamp(),
        });
        Alert.alert(
          "🎉 Added",
          `New location "${locationName}" has been added.`
        );
      }

      setLocationName("");
      setLatitude("");
      setLongitude("");
      setTime("");
      fetchLocations();
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save data");
    }
  };

  // Delete location
  const deleteLocation = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "elephant_locations", id));
            fetchLocations();
          } catch (error) {
            console.error("Delete error:", error);
          }
        },
      },
    ]);
  };

  // Edit location
  const editLocation = (loc) => {
    setLocationName(loc.locationName || "");
    setLatitude(loc.latitude?.toString() || "");
    setLongitude(loc.longitude?.toString() || "");
    setDate(loc.timestamp?.toDate() || new Date());
    if (loc.timestamp?.toDate) {
      const hours = loc.timestamp.toDate().getHours();
      const minutes = loc.timestamp.toDate().getMinutes();
      const formattedTime = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
      setTime(formattedTime);
    }
    setEditId(loc.id);
  };

  // Open in Google Maps
  const openInMap = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open map:", err)
    );
  };

  return (
    <View style={styles.container}>
      {/* 🌿 Curved Header */}
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
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("WildlifeDashboard")}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Elephant Collision Data</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* 📝 Form Section */}
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={styles.formContainer}>
          <Text style={styles.pageHeader}>
            {editId
              ? "✏️ Edit Elephant Collision Data"
              : "🚨 Add Elephant Collision Data"}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location Name</Text>
            <TextInput
              placeholder="Enter location name"
              value={locationName}
              onChangeText={setLocationName}
              style={styles.input}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 5 }]}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                placeholder="e.g. 7.8714"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 5 }]}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                placeholder="e.g. 80.7718"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          {/* Inline Date Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={date.toDateString()}
              onFocus={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>

          {/* Inline Time Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              value={time}
              placeholder="HH:MM AM/PM"
              onFocus={() => setShowTimePicker(true)}
            />
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    const hours = selectedTime.getHours();
                    const minutes = selectedTime.getMinutes();
                    const formattedTime = `${hours % 12 || 12}:${minutes
                      .toString()
                      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
                    setTime(formattedTime);
                  }
                }}
              />
            )}
          </View>

          <TouchableOpacity style={styles.addButton} onPress={saveLocation}>
            <Text style={styles.addButtonText}>
              {editId ? "Update Location" : "Add Location"}
            </Text>
          </TouchableOpacity>

          {/* Existing Locations */}
          <Text style={styles.subHeader}>📍 Existing Elephant Locations</Text>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : elephantLocations.length === 0 ? (
            <Text style={styles.emptyText}>No locations found</Text>
          ) : (
            elephantLocations.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.itemText}>
                  <Text style={{ fontWeight: "bold" }}>Location:</Text>{" "}
                  {item.locationName}
                </Text>
                <Text>Latitude: {item.latitude}</Text>
                <Text>Longitude: {item.longitude}</Text>
                <Text>
                  Date:{" "}
                  {item.timestamp?.toDate
                    ? item.timestamp.toDate().toDateString()
                    : ""}
                </Text>
                <Text>
                  Time:{" "}
                  {item.timestamp?.toDate
                    ? item.timestamp.toDate().toLocaleTimeString()
                    : ""}
                </Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => openInMap(item.latitude, item.longitude)}
                  >
                    <Text style={styles.mapButtonText}>📌 Open Map</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editLocation(item)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteLocation(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <LinearGradient
        colors={["rgba(245, 250, 245, 1)", "#f2f7f2ff"]}
        style={styles.footer}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("index")}
          style={styles.navButton}
        >
          <Entypo name="home" size={24} color="#004d00" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddCollision")}
          style={styles.navButton}
        >
          <MaterialCommunityIcons
            name="plus-circle"
            size={26}
            color="#004d00"
          />
          <Text style={styles.footerText}>Add Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.google.com/maps")}
          style={styles.navButton}
        >
          <Ionicons name="map-outline" size={24} color="#004d00" />
          <Text style={styles.footerText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("WildViewNews")} style={styles.navButton}>
                  <Entypo name="news" size={24} color="#004d00" />
                  <Text style={styles.footerText}>News</Text>
                </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  headerWrapper: {
    position: "relative",
    height: 160,
    justifyContent: "center",
  },
  curve: { position: "absolute", top: 0, left: 0 },
  headerContent: {
    position: "absolute",
    top: 70,
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 20,
  },
  formContainer: { padding: 20 },
  pageHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputGroup: { marginBottom: 10 },
  label: { fontSize: 14, marginBottom: 4, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  row: { flexDirection: "row" },
  addButton: {
    backgroundColor: "#228B22",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#eef2ee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: { fontSize: 15 },
  actionRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },
  mapButton: {
    backgroundColor: "#c0e8c0",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 4,
    alignItems: "center",
  },
  mapButtonText: { color: "#003300", fontWeight: "bold" },
  editButton: {
    backgroundColor: "#ffe08a",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 4,
    alignItems: "center",
  },
  editButtonText: { color: "#000", fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#DC143C",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 20,
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

// app/AddCollision.jsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
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
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebaseConfig";

export default function AddCollision() {
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [elephantLocations, setElephantLocations] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  // Fetch existing elephant locations
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
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Create or Update location
  const saveLocation = async () => {
  if (!locationName || !latitude || !longitude || !date || !time) {
    Alert.alert("Error", "Please fill all fields!");
    return;
  }

  try {
    // Parse hours and minutes from the time string
    let [timePart, meridiem] = time.split(" "); // ["3:30", "PM"]
    let [hours, minutes] = timePart.split(":").map(Number);

    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    // Create a valid timestamp
    const timestamp = new Date(date);
    timestamp.setHours(hours, minutes, 0, 0); // set HH:MM:SS:MS

    if (editId) {
      const docRef = doc(db, "elephant_locations", editId);
      await updateDoc(docRef, {
        locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timestamp,
      });
      Alert.alert("✅ Updated", `Location "${locationName}" has been updated!`);
      setEditId(null);
    } else {
      await addDoc(collection(db, "elephant_locations"), {
        locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timestamp,
        createdAt: serverTimestamp(),
      });
      Alert.alert("🎉 Added", `New location "${locationName}" has been added!`);
    }

    // Reset form
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
    setLatitude(loc.latitude !== undefined ? loc.latitude.toString() : "");
    setLongitude(loc.longitude !== undefined ? loc.longitude.toString() : "");
    setDate(loc.timestamp ? loc.timestamp.toDate() || new Date(loc.timestamp) : new Date());
    setTime(
      loc.timestamp
        ? `${loc.timestamp.toDate().getHours()}:${loc.timestamp.toDate().getMinutes()}`
        : ""
    );
    setEditId(loc.id);
  };

  // Open in Google Maps
  const openInMap = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch((err) => console.error("Failed to open map:", err));
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 34, color: "#0b0d0cff",marginTop:25, marginBottom:15, textAlign: "center", fontWeight: "bold" }}>
        {editId ? "✏️ Edit Elephant Collision Location" : "🚨 Add Elephant Collision Location"}
      </Text>

      <TextInput
        placeholder="Location name"
        value={locationName}
        onChangeText={setLocationName}
        style={styles.input}
      />
      <TextInput
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Date Picker */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {date ? date.toDateString() : "Select Date"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Time Picker */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.dateButtonText}>{time ? time : "Select Time"}</Text>
      </TouchableOpacity>
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

      <TouchableOpacity style={styles.addButton} onPress={saveLocation}>
        <Text style={styles.addButtonText}>
          {editId ? "Update Location" : "Add Location"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>📍 Existing Elephant Locations</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={elephantLocations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>
                <Text style={{ fontWeight: "bold" }}>Location:</Text> {item.locationName}
              </Text>
              <Text>Latitude: {item.latitude}</Text>
              <Text>Longitude: {item.longitude}</Text>
              <Text>
                Date: {item.timestamp?.toDate ? item.timestamp.toDate().toDateString() : ""}
              </Text>
              <Text>
                Time: {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleTimeString() : ""}
              </Text>

              <View style={{ flexDirection: "row", marginTop: 8, justifyContent: "space-between" }}>
                <TouchableOpacity style={styles.mapButton} onPress={() => openInMap(item.latitude, item.longitude)}>
                  <Text style={styles.mapButtonText}>Open in Map</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.editButton} onPress={() => editLocation(item)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLocation(item.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => <Text style={styles.emptyText}>No locations found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  subHeader: { fontSize: 18, fontWeight: "bold", marginTop: 25, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dateButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: { color: "#fff", fontWeight: "bold" },
  addButton: {
    backgroundColor: "#32CD32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  item: { backgroundColor: "#f0f0f0", padding: 12, borderRadius: 8, marginBottom: 8 },
  itemText: { fontSize: 15 },
  emptyText: { textAlign: "center", color: "#888", marginTop: 20 },
  mapButton: { backgroundColor: "#FF6347", padding: 8, borderRadius: 6, flex: 1, marginRight: 5, alignItems: "center" },
  mapButtonText: { color: "#fff", fontWeight: "bold" },
  editButton: { backgroundColor: "#FFD700", padding: 8, borderRadius: 6, flex: 1, marginRight: 5, alignItems: "center" },
  editButtonText: { color: "#000", fontWeight: "bold" },
  deleteButton: { backgroundColor: "#DC143C", padding: 8, borderRadius: 6, flex: 1, alignItems: "center" },
  deleteButtonText: { color: "#fff", fontWeight: "bold" },
});

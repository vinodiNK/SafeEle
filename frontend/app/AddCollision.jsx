// app/AddCollision.jsx
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { useEffect, useState } from "react";
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
  const [collisionZones, setCollisionZones] = useState([]);
  const [editId, setEditId] = useState(null); // Track zone being edited

  // ✅ Fetch existing zones
  const fetchZones = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "collisionZones"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const zones = [];
      querySnapshot.forEach((doc) => zones.push({ id: doc.id, ...doc.data() }));
      setCollisionZones(zones);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  // ✅ Create or Update collision zone
  const saveCollisionZone = async () => {
    if (!locationName || !latitude || !longitude || !date || !time) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      if (editId) {
        // Update
        const docRef = doc(db, "collisionZones", editId);
        await updateDoc(docRef, {
          locationName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          date: date.toDateString(),
          time,
        });
        Alert.alert("Success", "Collision zone updated!");
        setEditId(null);
      } else {
        // Create
        await addDoc(collection(db, "collisionZones"), {
          locationName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          date: date.toDateString(),
          time,
          createdAt: serverTimestamp(),
        });
        Alert.alert("Success", "New collision zone added!");
      }

      // Reset form
      setLocationName("");
      setLatitude("");
      setLongitude("");
      setTime("");
      fetchZones();
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save data");
    }
  };

  // ✅ Delete a zone
  const deleteZone = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this zone?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "collisionZones", id));
            fetchZones();
          } catch (error) {
            console.error("Delete error:", error);
          }
        },
      },
    ]);
  };

  // ✅ Edit a zone (populate form)
 const editZone = (zone) => {
  setLocationName(zone.locationName || "");
  setLatitude(zone.latitude !== undefined ? zone.latitude.toString() : "");
  setLongitude(zone.longitude !== undefined ? zone.longitude.toString() : "");
  setDate(zone.date ? new Date(zone.date) : new Date());
  setTime(zone.time || "");
  setEditId(zone.id);
};


  // ✅ Open in Google Maps
  const openInMap = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch((err) => console.error("Failed to open map:", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {editId ? "✏️ Edit Elephant Collision Zone" : "🚨 Add Elephant Collision Zone"}
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
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
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
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
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

      <TouchableOpacity style={styles.addButton} onPress={saveCollisionZone}>
        <Text style={styles.addButtonText}>
          {editId ? "Update Collision Zone" : "Add Collision Zone"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>📍 Existing Collision Zones</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={collisionZones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>
                <Text style={{ fontWeight: "bold" }}>Location:</Text> {item.locationName}
              </Text>
              <Text>Latitude: {item.latitude}</Text>
              <Text>Longitude: {item.longitude}</Text>
              <Text>Date: {item.date}</Text>
              <Text>Time: {item.time}</Text>

              <View style={{ flexDirection: "row", marginTop: 8, justifyContent: "space-between" }}>
                <TouchableOpacity style={styles.mapButton} onPress={() => openInMap(item.latitude, item.longitude)}>
                  <Text style={styles.mapButtonText}>Open in Map</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.editButton} onPress={() => editZone(item)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteZone(item.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => <Text style={styles.emptyText}>No collision zones found</Text>}
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

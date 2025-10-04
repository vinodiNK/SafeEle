// app/ViewReport.jsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebaseConfig";

export default function ViewReport() {
  const [locationName, setLocationName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [collisionZones, setCollisionZones] = useState([]);

  // Fetch existing zones
  const fetchZones = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "collisionZones"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const zones = [];
      querySnapshot.forEach((doc) => {
        zones.push({ id: doc.id, ...doc.data() });
      });
      setCollisionZones(zones);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  // Add new collision zone
  const addCollisionZone = async () => {
    if (!locationName || !date || !time) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "collisionZones"), {
        locationName,
        date: date.toDateString(),
        time,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "New collision zone added!");
      setLocationName("");
      setTime("");
      fetchZones();
    } catch (error) {
      console.error("Add error:", error);
      Alert.alert("Error", "Failed to add data");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚨 Add Elephant Collision Zone</Text>

      <TextInput
        placeholder="Location name"
        value={locationName}
        onChangeText={setLocationName}
        style={styles.input}
      />

      {/* Date Picker */}
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>{date ? date.toDateString() : "Select Date"}</Text>
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

      <TouchableOpacity style={styles.addButton} onPress={addCollisionZone}>
        <Text style={styles.addButtonText}>Add Collision Zone</Text>
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
              <Text>Date: {item.date}</Text>
              <Text>Time: {item.time}</Text>
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
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10, backgroundColor: "#fff" },
  dateButton: { backgroundColor: "#1E90FF", padding: 10, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  dateButtonText: { color: "#fff", fontWeight: "bold" },
  addButton: { backgroundColor: "#32CD32", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  item: { backgroundColor: "#f0f0f0", padding: 12, borderRadius: 8, marginBottom: 8 },
  itemText: { fontSize: 15 },
  emptyText: { textAlign: "center", color: "#888", marginTop: 20 },
});

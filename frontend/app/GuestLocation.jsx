// app/GuestLocation.jsx
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from "expo-print"; // ✅ PDF generation
import * as Sharing from "expo-sharing";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../firebaseConfig";

export default function GuestLocation() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areaFilter, setAreaFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "guestLocations"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const locs = [];
      querySnapshot.forEach((doc) => {
        locs.push({ id: doc.id, ...doc.data() });
      });
      setLocations(locs);
      setFilteredLocations(locs); // initial = all
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openInMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const applyFilter = () => {
    let filtered = locations;

    if (areaFilter.trim() !== "") {
      filtered = filtered.filter((loc) =>
        loc.locationName?.toLowerCase().includes(areaFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      const selectedDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter((loc) => {
        if (loc.timestamp?.toDate) {
          return loc.timestamp.toDate().toDateString() === selectedDate;
        }
        return false;
      });
    }

    setFilteredLocations(filtered);
  };

  // ✅ Generate PDF Report
  const generatePDF = async () => {
  try {
    const html = `
      <h1>Guest Elephant Sightings Report</h1>
      <p>Total Records: ${filteredLocations.length}</p>
      <table border="1" cellspacing="0" cellpadding="5">
        <tr>
          <th>Location</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Date & Time</th>
        </tr>
        ${filteredLocations
          .map(
            (loc) => `
          <tr>
            <td>${loc.locationName || "Unknown"}</td>
            <td>${loc.latitude}</td>
            <td>${loc.longitude}</td>
            <td>${
              loc.timestamp?.toDate
                ? loc.timestamp.toDate().toLocaleString()
                : loc.timestamp
            }</td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    // ✅ Open Share Menu → user can pick Google Drive
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Saved", "PDF generated but sharing is not available.");
    }
  } catch (err) {
    console.error("PDF error:", err);
    Alert.alert("Error", "Failed to generate PDF");
  }
};


  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Guest Updated Locations</Text>

      {/* Filters */}
      <TextInput
        placeholder="Search by area..."
        style={styles.input}
        value={areaFilter}
        onChangeText={setAreaFilter}
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {dateFilter ? new Date(dateFilter).toDateString() : "Filter by Date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dateFilter ? new Date(dateFilter) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDateFilter(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.filterButton} onPress={applyFilter}>
        <Text style={styles.filterButtonText}>Apply Filter</Text>
      </TouchableOpacity>

      {/* ✅ Download PDF Button */}
      <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
        <Text style={styles.pdfButtonText}>Download PDF Report</Text>
      </TouchableOpacity>

      {/* List of guest locations */}
      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.noDataText}>No data found</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.locationName}>{item.locationName}</Text>
            <Text>Latitude: {item.latitude}</Text>
            <Text>Longitude: {item.longitude}</Text>
            <Text>
              Date & Time:{" "}
              {item.timestamp?.toDate
                ? item.timestamp.toDate().toLocaleString()
                : item.timestamp}
            </Text>

            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => openInMap(item.latitude, item.longitude)}
            >
              <Text style={styles.mapButtonText}>Open in Map</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#2e8b57",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  dateButtonText: { color: "#fff", fontWeight: "bold" },
  filterButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: "center",
  },
  filterButtonText: { color: "#fff", fontWeight: "bold" },
  pdfButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: "center",
  },
  pdfButtonText: { color: "#fff", fontWeight: "bold" },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  locationName: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  mapButton: {
    marginTop: 10,
    backgroundColor: "#2e8b57",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  mapButtonText: { color: "#fff", fontWeight: "bold" },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
  },
});

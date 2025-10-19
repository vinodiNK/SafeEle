import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { db } from "../firebaseConfig";

export default function CollisionZone() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areaFilter, setAreaFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const q = query(collection(db, "collisionZones"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const locs = [];
      querySnapshot.forEach((doc) => {
        locs.push({ id: doc.id, ...doc.data() });
      });
      setLocations(locs);
      setFilteredLocations(locs);
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
    setShowChart(false);
  };

  const generatePDF = async () => {
    try {
      const html = `
        <h1>Elephant Collision Zones Report</h1>
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
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Success", "PDF generated successfully ✅");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  const handleDataAnalysis = () => {
    if (showChart) {
      setShowChart(false);
      return;
    }
    const locationCounts = {};
    filteredLocations.forEach((loc) => {
      const name = loc.locationName || "Unknown";
      locationCounts[name] = (locationCounts[name] || 0) + 1;
    });
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#8BC34A",
      "#FF9800",
      "#9C27B0",
      "#00BCD4",
      "#E91E63",
    ];
    const chartEntries = Object.keys(locationCounts).map((name, i) => ({
      name,
      population: locationCounts[name],
      color: colors[i % colors.length],
      legendFontColor: "#333",
      legendFontSize: 13,
    }));
    setChartData(chartEntries);
    setShowChart(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  const screenWidth = Dimensions.get("window").width - 20;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Past Elephant Collision Zones</Text>

      {/* Search & Filters Section */}
      <View style={styles.filterContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search by area..."
            style={styles.searchInput}
            value={areaFilter}
            onChangeText={setAreaFilter}
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={18} color="#fff" />
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

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.filterButton} onPress={applyFilter}>
            <MaterialCommunityIcons name="filter" size={20} color="#fff" />
            <Text style={styles.filterButtonText}>Apply</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
            <Ionicons name="document-text-outline" size={20} color="#fff" />
            <Text style={styles.filterButtonText}>PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.analysisButton} onPress={handleDataAnalysis}>
            <Ionicons name="analytics-outline" size={20} color="#fff" />
            <Text style={styles.filterButtonText}>Analyze</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showChart && chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Elephant Sightings by Location</Text>
          <PieChart
            data={chartData}
            width={screenWidth}
            height={220}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"10"}
            absolute
            chartConfig={{
              backgroundColor: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        </View>
      )}

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
              <Ionicons name="map-outline" size={18} color="#2e8b57" />
              <Text style={styles.mapButtonText}>Open in Map</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Footer with icons only */}
<LinearGradient colors={["#004d00", "#006400"]} style={styles.footer}>
  {/* Home */}
  <TouchableOpacity onPress={() => navigation.navigate("index")} style={styles.navButton}>
    <Entypo name="home" size={24} color="#c8e6c9" />
    <Text style={styles.footerText}>Home</Text>
  </TouchableOpacity>

  {/* Add Data */}
  <TouchableOpacity onPress={() => navigation.navigate("AddCollision")} style={styles.navButton}>
    <MaterialCommunityIcons name="plus-circle" size={26} color="#c8e6c9" />
    <Text style={styles.footerText}>Add Data</Text>
  </TouchableOpacity>

  {/* Message */}
  <TouchableOpacity onPress={() => navigation.navigate("Message")} style={styles.navButton}>
    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#c8e6c9" />
    <Text style={styles.footerText}>Message</Text>
  </TouchableOpacity>

  {/* Back Button */}
  <TouchableOpacity onPress={() => navigation.navigate("WildlifeDashboard")} style={styles.navButton}>
    <Ionicons name="arrow-back" size={24} color="#c8e6c9" />
    <Text style={styles.footerText}>Back</Text>
  </TouchableOpacity>
</LinearGradient>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff", paddingBottom: 80 },
  headerTitle: {
    fontSize: 26,
    color: "#0a3d0a",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 35,
    marginBottom: 10,
  },

  filterContainer: {
    backgroundColor: "#f0f8f5",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  searchInput: {
    flex: 1,
    marginLeft: 5,
    height: 40,
  },
  dateButton: {
    flexDirection: "row",
    backgroundColor: "#2e8b57",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  dateButtonText: { color: "#fff", marginLeft: 6, fontWeight: "bold" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginHorizontal: 3,
  },
  pdfButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginHorizontal: 3,
  },
  analysisButton: {
    backgroundColor: "#FF9800",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginHorizontal: 3,
  },
  filterButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 5 },

  chartContainer: { alignItems: "center", marginBottom: 20 },
  chartTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
  },
  locationName: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  mapButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f4ea",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  mapButtonText: { color: "#2e8b57", fontWeight: "bold", marginLeft: 5 },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "90%",
    alignSelf: "center",
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 10,
    elevation: 10,
  },
});

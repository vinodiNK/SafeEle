import { Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
      "#FF6384", "#36A2EB", "#FFCE56", "#8BC34A",
      "#FF9800", "#9C27B0", "#00BCD4", "#E91E63",
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

      <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
        <Text style={styles.pdfButtonText}>Download PDF Report</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.analysisButton} onPress={handleDataAnalysis}>
        <Text style={styles.analysisButtonText}>
          {showChart ? "Hide Chart" : "Analyze Data"}
        </Text>
      </TouchableOpacity>

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
              <Text style={styles.mapButtonText}>Open in Map</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🔹 Footer Navigation */}
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

        {/* Profile */}
        <TouchableOpacity onPress={() => navigation.navigate("WildProfile")} style={styles.navButton}>
          <FontAwesome5 name="user-alt" size={20} color="#c8e6c9" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff", paddingBottom: 80 },
  headerTitle: {
    fontSize: 28,
    color: "#0a3d0aff",
    marginBottom: 20,
    marginTop: 35,
    textAlign: "center",
    fontWeight: "bold",
  },
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
    backgroundColor: "#22bdff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: "center",
  },
  pdfButtonText: { color: "#fff", fontWeight: "bold" },
  analysisButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: "center",
  },
  analysisButtonText: { color: "#fff", fontWeight: "bold" },
  chartContainer: { alignItems: "center", marginBottom: 20 },
  chartTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  item: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  locationName: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  mapButton: {
    marginTop: 10,
    backgroundColor: "#f0ebebff",
    padding: 8,
    borderRadius: 6,
    alignItems: "left",
  },
  mapButtonText: { color: "#141414ff", fontWeight: "bold" },
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
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 10,
    elevation: 10,
  },
  navButton: { alignItems: "center" },
  footerText: { color: "#c8e6c9", fontSize: 12, marginTop: 2 },
});

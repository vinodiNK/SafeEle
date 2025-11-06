// app/GuestLocation.jsx
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from "react-native-svg";
import { db } from "../firebaseConfig";

export default function GuestLocation() {
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
    const q = query(collection(db, "guestLocations"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const locs = [];
      querySnapshot.forEach((doc) => locs.push({ id: doc.id, ...doc.data() }));
      setLocations(locs);
      setFilteredLocations(locs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openInMap = (latitude, longitude) => {
    Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`);
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
      filtered = filtered.filter(
        (loc) => loc.timestamp?.toDate?.().toDateString() === selectedDate
      );
    }
    setFilteredLocations(filtered);
    setShowChart(false);
  };

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
            </tr>`
            )
            .join("")}
        </table>`;
      const { uri } = await Print.printToFileAsync({ html });
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

  const analyzeData = () => {
    if (showChart) return setShowChart(false);
    if (filteredLocations.length === 0)
      return Alert.alert("No Data", "No records available for analysis");

    const counts = {};
    filteredLocations.forEach((loc) => {
      const area = loc.locationName || "Unknown";
      counts[area] = (counts[area] || 0) + 1;
    });

    const data = Object.keys(counts).map((area, index) => ({
      name: area,
      population: counts[area],
      color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"][index % 6],
      legendFontColor: "#333",
      legendFontSize: 14,
    }));

    setChartData(data);
    setShowChart(true);
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  const screenWidth = Dimensions.get("window").width - 20;

  return (
    <View style={styles.container}>
      {/* 🌿 Header */}
      <View style={styles.headerWrapper}>
        <Svg height="300" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
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
        <Svg height="220" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
        </Svg>
        <Text style={styles.headerTitle}>Guest Updated Locations</Text>
        <Text style={styles.headerSubTitle}>View all recent locations reported by guests</Text>
      </View>

      {/* 🔍 Two Search Boxes */}
      <View style={styles.filterContainer}>
        {/* Search by Area */}
        <View style={styles.fullBox}>
          <View style={styles.inputRow}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              placeholder="Search by area..."
              style={styles.textInput}
              value={areaFilter}
              onChangeText={setAreaFilter}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.searchButton} onPress={applyFilter}>
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search by Date */}
        <View style={styles.fullBox}>
          <View style={styles.inputRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.8}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateFilterText}>
                {dateFilter ? new Date(dateFilter).toDateString() : "Search by Date"}
              </Text>
            </TouchableOpacity>
            {dateFilter ? (
              <TouchableOpacity onPress={() => setDateFilter(null)}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.searchButton} onPress={applyFilter}>
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateFilter ? new Date(dateFilter) : new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDateFilter(selectedDate);
            }}
          />
        )}

        {/* Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={generatePDF}>
            <Ionicons name="document-text-outline" size={22} color="#fff" />
            <Text style={styles.actionText}>PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={analyzeData}>
            <Ionicons name="analytics-outline" size={22} color="#fff" />
            <Text style={styles.actionText}>{showChart ? "Hide" : "Analyze"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart */}
      {showChart && chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Sightings by Area</Text>
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

      {/* Data List */}
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
              <Text style={styles.mapButtonText}> Open in Map</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Footer */}
      <LinearGradient colors={["#f5faf5ff", "#f3f8f3ff"]} style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("index")} style={styles.navButton}>
          <Entypo name="home" size={24} color="#004d00" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("AddCollision")} style={styles.navButton}>
          <MaterialCommunityIcons name="plus-circle" size={26} color="#004d00" />
          <Text style={styles.footerText}>Add Data</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Message")} style={styles.navButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#004d00" />
          <Text style={styles.footerText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("WildlifeDashboard")} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="#004d00" />
          <Text style={styles.footerText}>Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5faf5",
  },
  headerWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  curve: {
    position: "absolute",
    top: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 80,
  },
  headerSubTitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 50,
  },
  filterContainer: {
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 12,
    elevation: 3,
  },
  fullBox: { marginTop: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 45,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  dateFilterText: { color: "#333", fontSize: 16 },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004d00",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  locationName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#004d00",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  mapButtonText: {
    color: "#2e8b57",
    fontWeight: "bold",
    marginLeft: 4,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
  footer: {
    position: "absolute",
    bottom: 35,
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

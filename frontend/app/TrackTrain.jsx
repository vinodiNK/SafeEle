// app/TrackTrain.jsx
import { useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TrackTrain() {
  const navigation = useNavigation();

  // Handle train button click
  const handleTrainPress = (trainName) => {
    Alert.alert("Train Selected", `You selected: ${trainName}`);
    // Optionally navigate to a detailed train tracking screen
    // navigation.navigate("TrainDetailScreen", { trainName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Track Train</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTrainPress("Yal Devi/යාල් දේවි")}
      >
        <Text style={styles.buttonText}>Yal Devi / යාල් දේවි</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTrainPress("Rajarata Rejini/රජරට රැජිණි")}
      >
        <Text style={styles.buttonText}>Rajarata Rajini / රජරට රැජිණි</Text>
      </TouchableOpacity>

      {/* Go Back Button */}
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.navigate("StationDashboard")}
      >
        <Text style={styles.goBackButtonText}>Go Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5", justifyContent: "center" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 30, textAlign: "center", color: "#2e8b57" },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  goBackButton: {
    backgroundColor: "#2e8b57",
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  goBackButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

// app/SendNews.jsx
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NewsImage from "../assets/news.png";
import { db } from "../firebaseConfig";

export default function SendNews() {
  const [station, setStation] = useState("");
  const [trainName, setTrainName] = useState("");
  const [stations, setStations] = useState([]);
  const [title, setTitle] = useState("");
  const [news, setNews] = useState("");
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/vinodiNK/sl-railway-api/main/stations.json"
    )
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Failed to fetch stations:", err));
  }, []);

  const handleSend = async () => {
    if (!trainName || !station || !title || !news) {
      Alert.alert("Error", "Please fill all fields before sending.");
      return;
    }

    try {
      await addDoc(collection(db, "news"), {
        trainName,
        station,
        title,
        news,
        createdAt: serverTimestamp(),
      });
      Alert.alert("✅ Success", "News sent successfully!");
      setTrainName("");
      setStation("");
      setTitle("");
      setNews("");
    } catch (error) {
      console.error("Error adding news:", error);
      Alert.alert("Error", "Failed to send news.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Gradient Header */}
      <LinearGradient colors={["#006400", "#228B22"]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTextLeft}>Train ID: 1234</Text>
          <Text style={styles.headerTextRight}>Lakshman</Text>
        </View>
        <Text style={styles.subtitle}>Sending updates</Text>
        <Text style={styles.title}>Send News</Text>
      </LinearGradient>

      {/* 🔹 Illustration */}
      <Image source={NewsImage} style={styles.image} resizeMode="contain" />

      {/* 🔹 Form Section */}
      <View style={styles.formContainer}>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={trainName}
            style={styles.dropdown}
            dropdownIconColor="#004d00"
            onValueChange={(value) => setTrainName(value)}
          >
            <Picker.Item label="Train Name" value="" />
            <Picker.Item label="Yal Devi" value="Yal Devi" />
            <Picker.Item label="Udarata Rejina" value="Udarata Rejina" />
          </Picker>
        </View>

        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={station}
            style={styles.dropdown}
            dropdownIconColor="#004d00"
            onValueChange={(value) => setStation(value)}
          >
            <Picker.Item label="Station Name" value="" />
            {stations.map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s.name} />
            ))}
          </Picker>
        </View>

        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={title}
            style={styles.dropdown}
            dropdownIconColor="#004d00"
            onValueChange={(value) => setTitle(value)}
          >
            <Picker.Item label="Title" value="" />
            <Picker.Item label="Train Delay" value="Train Delay" />
            <Picker.Item label="Accident Update" value="Accident Update" />
            <Picker.Item label="Technical Issue" value="Technical Issue" />
            <Picker.Item label="Other Updates" value="Other Updates" />
          </Picker>
        </View>

        <TextInput
          style={styles.textBox}
          placeholder="Enter News Here..."
          placeholderTextColor="#004d00"
          value={news}
          onChangeText={setNews}
          multiline
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Floating Footer Navigation */}
      <LinearGradient colors={["#004d00", "#006400"]} style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("index")}
          style={styles.navButton}
        >
          <Entypo name="home" size={22} color="#c8e6c9" />
          <Text style={styles.footerTextActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Map")}
          style={styles.navButton}
        >
          <Entypo name="location-pin" size={26} color="white" />
          <Text style={styles.footerText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Messages")}
          style={styles.navButton}
        >
          <MaterialIcons name="message" size={22} color="#fff" />
          <Text style={styles.footerText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.navButton}
        >
          <FontAwesome5 name="user-alt" size={20} color="#c8e6c9" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5e9" },

  header: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 5,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTextLeft: { color: "#e0f7e9", fontSize: 14, fontWeight: "bold" },
  headerTextRight: { color: "#e0f7e9", fontSize: 14, fontWeight: "bold" },
  subtitle: { color: "#dff5df", fontSize: 16, textAlign: "center", marginTop: 10 },
  title: { color: "white", fontSize: 34, fontWeight: "bold", textAlign: "center" },

  image: { width: "100%", height: 230, marginTop: 5 },

  formContainer: {
    alignItems: "center",
    marginTop: -10,
    paddingBottom: 80,
  },

  dropdownContainer: {
    width: "85%",
    borderRadius: 25,
    backgroundColor: "#d0f0d0",
    marginTop: 15,
    paddingLeft: 10,
    elevation: 2,
  },
  dropdown: { height: 50, width: "100%" },

  textBox: {
    width: "85%",
    height: 110,
    borderRadius: 25,
    backgroundColor: "#d0f0d0",
    padding: 15,
    marginTop: 10,
    color: "#2e7d32",
    textAlignVertical: "top",
  },

  sendButton: {
    width: 160,
    backgroundColor: "#7dd583ff",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    elevation: 3,
  },
  sendButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },

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
  footerTextActive: { color: "white", fontSize: 12, fontWeight: "bold", marginTop: 2 },
});

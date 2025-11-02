import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MessageImage from "../assets/news.png"; // ✅ change to your image path
import { db } from "../firebaseConfig"; // ✅ your Firestore config

export default function StationMessage() {
  const navigation = useNavigation();
  const [station, setStation] = useState("");
  const [title, setTitle] = useState("");
  const [news, setNews] = useState("");

  const handleSend = async () => {
    if (!station || !title || !news) {
      Alert.alert("Error", "Please fill all fields before sending.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        station,
        title,
        news,
        createdAt: serverTimestamp(),
      });
      Alert.alert("✅ Success", "Message sent to Wildlife Department!");
      setStation("");
      setTitle("");
      setNews("");
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Try again.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Send Message</Text>
        <Text style={styles.subTitle}>Sending updates to Wildlife Department</Text>
      </View>

      {/* 🔹 Image Section */}
      <Image source={MessageImage} style={styles.image} resizeMode="contain" />

      {/* 🔹 Form Section */}
      <View style={styles.formContainer}>
        {/* Station Picker */}
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={station}
            style={styles.dropdown}
            dropdownIconColor="#004d00"
            onValueChange={(value) => setStation(value)}
          >
            <Picker.Item label="Station Name" value="" />
            <Picker.Item label="Colombo Fort" value="Colombo Fort" />
            <Picker.Item label="Kandy" value="Kandy" />
            <Picker.Item label="Anuradhapura" value="Anuradhapura" />
            <Picker.Item label="Jaffna" value="Jaffna" />
          </Picker>
        </View>

        {/* Title Picker */}
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={title}
            style={styles.dropdown}
            dropdownIconColor="#004d00"
            onValueChange={(value) => setTitle(value)}
          >
            <Picker.Item label="Title" value="" />
            <Picker.Item label="Elephant Sighting" value="Elephant Sighting" />
            <Picker.Item label="Track Damage" value="Track Damage" />
            <Picker.Item label="Weather Alert" value="Weather Alert" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* News Textbox */}
        <TextInput
          style={styles.textBox}
          placeholder="Enter News Here..."
          placeholderTextColor="#004d00"
          value={news}
          onChangeText={setNews}
          multiline
        />

        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Bottom Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("index")} style={styles.navButton}>
          <Entypo name="home" size={22} color="#004d00" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("StationViewNews")} style={styles.navButton}>
          <Entypo name="news" size={22} color="#004d00" />
          <Text style={styles.footerText}>News</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("StationMessage")}
          style={styles.navButton}
        >
          <MaterialIcons name="message" size={22} color="#004d00" />
          <Text style={styles.footerTextActive}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("StationProfile")}
          style={styles.navButton}
        >
          <FontAwesome5 name="user-alt" size={20} color="#004d00" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5e9", alignItems: "center" },
  header: { width: "100%", paddingTop: 50, backgroundColor: "#4CAF50", paddingBottom: 20 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    marginTop: 5,
  },
  image: {
    width: 250,
    height: 180,
    marginTop: 20,
  },
  formContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  dropdownContainer: {
    width: "100%",
    borderRadius: 25,
    backgroundColor: "#C8E6C9",
    marginTop: 15,
    paddingLeft: 10,
  },
  dropdown: { height: 50, width: "100%" },
  textBox: {
    width: "100%",
    height: 100,
    borderRadius: 25,
    backgroundColor: "#C8E6C9",
    padding: 15,
    marginTop: 15,
    color: "#2e7d32",
    textAlignVertical: "top",
  },
  sendButton: {
    width: "60%",
    backgroundColor: "#388E3C",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
  },
  sendButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2 },
  footerTextActive: { color: "#2E7D32", fontSize: 12, marginTop: 2, fontWeight: "bold" },
});

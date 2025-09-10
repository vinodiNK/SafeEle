// app/SendNews.jsx
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BackgroundImage from "../assets/Layer.png";
import NewsImage from "../assets/news.png";

export default function SendNews() {
  const [station, setStation] = useState("");
  const [stations, setStations] = useState([]); // ✅ stations fetched from API
  const [title, setTitle] = useState("");
  const [news, setNews] = useState("");
  const [useAltStyle, setUseAltStyle] = useState(false); // toggle styles

  // Fetch stations from online API (GitHub raw JSON)
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/vinodiNK/sl-railway-api/main/stations.json") // replace <username> with your GitHub username
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Failed to fetch stations:", err));
  }, []);

  const handleSend = () => {
    console.log("Station:", station);
    console.log("Title:", title);
    console.log("News:", news);
    // Here you can send data to your backend if needed
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
      {/* Title */}
      <View style={styles.header}>
        <Text style={useAltStyle ? styles.subtitleAlt : styles.subtitle}>Sending updates</Text>
        <Text style={useAltStyle ? styles.titleAlt : styles.title}>Send News</Text>
      </View>

      {/* Illustration */}
      <View style={styles.container}>
        <Image
          source={NewsImage} // you can add AlertImage if needed
          style={useAltStyle ? styles.imageAlt : styles.image}
          resizeMode="contain"
        />

        {/* Station Dropdown */}
        <View style={useAltStyle ? styles.dropdownContainerAlt : styles.dropdownContainer}>
          <Picker
            selectedValue={station}
            style={styles.dropdown}
            dropdownIconColor={useAltStyle ? "#1e88e5" : "#2e7d32"}
            onValueChange={(value) => setStation(value)}
          >
            <Picker.Item label="Station Name" value="" />
            {stations.map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s.name} />
            ))}
          </Picker>
        </View>

        {/* Title Dropdown */}
        <View style={useAltStyle ? styles.dropdownContainerAlt : styles.dropdownContainer}>
          <Picker
            selectedValue={title}
            style={styles.dropdown}
            dropdownIconColor={useAltStyle ? "#1e88e5" : "#2e7d32"}
            onValueChange={(value) => setTitle(value)}
          >
            <Picker.Item label="Title" value="" />
            <Picker.Item label="Train Delay" value="Train Delay" />
            <Picker.Item label="Accident Update" value="accident" />
            <Picker.Item label="Technical Issue" value="Technical Issue" />
            <Picker.Item label="Other Updates" value="Other Updates" />
          </Picker>
        </View>

        {/* News Text Box */}
        <TextInput
          style={useAltStyle ? styles.textBoxAlt : styles.textBox}
          placeholder="News"
          placeholderTextColor={useAltStyle ? "#1e88e5" : "#2e7d32"}
          value={news}
          onChangeText={setNews}
          multiline
        />

        {/* Send Button */}
        <TouchableOpacity
          style={useAltStyle ? styles.sendButtonAlt : styles.sendButton}
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, height:"50%", width: "100%", backgroundColor: "#e8f5e9" },
  header: { marginTop: 10, marginLeft: 20 },
  subtitle: { fontSize: 16, color: "white" },
  title: { fontSize: 28, fontWeight: "bold", color: "white" },
  subtitleAlt: { fontSize: 16, color: "#1e88e5" },
  titleAlt: { fontSize: 28, fontWeight: "bold", color: "#1e88e5" },
  container: { flex: 1, alignItems: "center", marginTop: 10 },
  image: { width: 550, height: 350, marginBottom: -70, borderRadius: 55, marginTop: 5 },
  imageAlt: { width: 220, height: 160, marginBottom: 5, borderRadius: 55, marginTop: 25 },
  dropdownContainer: {
    width: "85%",
    borderRadius: 25,
    backgroundColor: "#d0f0d0",
    marginTop: 15,
    paddingLeft: 15,
  },
  dropdownContainerAlt: {
    width: "85%",
    borderRadius: 10,
    backgroundColor: "#cfe8fc",
    marginTop: 15,
    paddingLeft: 15,
  },
  dropdown: { height: 50, width: "100%" },
  textBox: {
    width: "85%",
    height: 120,
    borderRadius: 25,
    backgroundColor: "#d0f0d0",
    padding: 15,
    marginTop: 10,
    color: "#2e7d32",
    textAlignVertical: "top",
  },
  textBoxAlt: {
    width: "85%",
    height: 110,
    borderRadius: 10,
    backgroundColor: "#cfe8fc",
    padding: 15,
    marginTop: 10,
    color: "#1e88e5",
    textAlignVertical: "top",
  },
  sendButton: {
    width: 150,
    backgroundColor: "#2e7d32",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
  },
  sendButtonAlt: {
    width: 150,
    backgroundColor: "#1e88e5",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

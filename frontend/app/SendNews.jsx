// app/SendNews.jsx
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
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
  const [title, setTitle] = useState("");
  const [news, setNews] = useState("");
  const [useAltStyle, setUseAltStyle] = useState(false); // ✅ toggle styles

  const handleSend = () => {
    console.log("Station:", station);
    console.log("Title:", title);
    console.log("News:", news);
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
          source={useAltStyle ? AlertImage : NewsImage}
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
            <Picker.Item label="Station A" value="a" />
            <Picker.Item label="Station B" value="b" />
            <Picker.Item label="Station C" value="c" />
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
            <Picker.Item label="Weather Alert" value="weather" />
            <Picker.Item label="Accident Update" value="accident" />
            <Picker.Item label="Schedule Change" value="schedule" />
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

  // ✅ Alternate text styles
  subtitleAlt: { fontSize: 16, color: "#1e88e5" },
  titleAlt: { fontSize: 28, fontWeight: "bold", color: "#1e88e5" },

  container: { flex: 1, alignItems: "center", marginTop: 10 },

  // ✅ Image styles
  image: { width: 550, height: 350, marginBottom: -70, borderRadius: 55,marginTop: 5 },
  imageAlt: { width: 220, height: 160, marginBottom: 5, borderRadius: 55, marginTop: 25 },

  // ✅ Dropdown styles
  // First dropdown style
dropdownContainer: {
  width: "85%",
  borderRadius: 25,
  backgroundColor: "#d0f0d0",
  marginTop: 15, // a little above original
  paddingLeft: 15,
},

// Second dropdown style
dropdownContainerAlt: {
  width: "85%",
  borderRadius: 10,
  backgroundColor: "#cfe8fc",
  marginTop: 15, // slightly lower than the first dropdown
  paddingLeft: 15,
},



  // ✅ Textbox styles
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
  width: 150, // fixed width or keep %
  backgroundColor: "#2e7d32",
  paddingVertical: 15,
  borderRadius: 25,
  alignItems: "center",
  marginTop: 15,
  position: "bottom", // enable absolute positioning
  left: 85, // distance from the left side
  // right: 10, // optional, distance from right
},


  
  
});

// app/SendNews.jsx
import { Picker } from "@react-native-picker/picker"; // ✅ dropdown
import { useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import BackgroundImage from "../assets/Layer.png"; // background image
import NewsImage from "../assets/news.png"; // top illustration

export default function SendNews() {
  const [firstValue, setFirstValue] = useState(""); 
  const [secondValue, setSecondValue] = useState("");

  return (
    <ImageBackground
      source={BackgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Title at the top */}
      <View style={styles.header}>
        <Text style={styles.title}>Send News</Text>
      </View>

      {/* Top Image below title */}
      <View style={styles.container}>
        <Image source={NewsImage} style={styles.image} resizeMode="contain" />

        {/* Dropdown 1 */}
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={firstValue}
            style={styles.dropdown}
            onValueChange={(itemValue) => setFirstValue(itemValue)}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Breaking News" value="breaking" />
            <Picker.Item label="Weather" value="weather" />
            <Picker.Item label="Sports" value="sports" />
            <Picker.Item label="Politics" value="politics" />
          </Picker>
        </View>

        {/* Dropdown 2 */}
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={secondValue}
            style={styles.dropdown}
            onValueChange={(itemValue) => setSecondValue(itemValue)}
          >
            <Picker.Item label="Select Region" value="" />
            <Picker.Item label="Local" value="local" />
            <Picker.Item label="National" value="national" />
            <Picker.Item label="International" value="international" />
          </Picker>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "50%" },

  header: {
    width: "100%",
    paddingTop: 60,
    paddingLeft: 20,
    alignItems: "flex-start",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "rgba(235, 243, 239, 1)",
  },

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
  },

  image: {
    width: 750,
    height: 300,
    marginBottom: 40,
  },

  dropdownContainer: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: "white",
  },

  dropdown: {
    width: "100%",
    height: 50,
  },
});

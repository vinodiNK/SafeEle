// app/SendNews.jsx
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Defs, Path, Stop, Svg, LinearGradient as SvgGradient } from "react-native-svg";
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={styles.container}>
      {/* 🌿 Curved Header */}
      <View style={styles.headerWrapper}>
        <Svg height="90" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path
            fill="url(#grad)"
            d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z"
          />
        </Svg>
         <Svg height="165" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path
            fill="url(#grad)"
            d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z"
          />
        </Svg>
         <Svg height="250" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#4CAF50" />
              <Stop offset="100%" stopColor="#006400" />
            </SvgGradient>
          </Defs>
          <Path
            fill="url(#grad)"
            d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z"
          />
        </Svg>
        
        {/* Header Text */}
        <View style={styles.headerTextContainer}>
          
        </View>
        
        <Text style={styles.title}>Send Message</Text>
        <Text style={styles.subtitle}>Sending updates to station</Text>
      </View>

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

        <View style={{ width: '85%', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
  <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
    <Text style={styles.sendButtonText}>Send</Text>
  </TouchableOpacity>
</View>

      </View>

      {/* 🔹 Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
  onPress={() => navigation.navigate("index")}
  style={styles.navButton}
>
  <FontAwesome5 name="home" size={24} color="#004d00" />
  <Text style={styles.footerText}>Home</Text>
</TouchableOpacity>


        <TouchableOpacity
  onPress={() => navigation.navigate("OpenMap")}
  style={styles.navButton}
>
  <FontAwesome5 name="map-marked-alt" size={24} color="#004d00" />
  <Text style={styles.footerText}>Map</Text>
</TouchableOpacity>


      <TouchableOpacity
  onPress={() => navigation.navigate("SendNews")}
  style={styles.navButton}
>
  <FontAwesome name="envelope" size={22} color="#004d00" />
  <Text style={styles.footerText}>Message</Text>
</TouchableOpacity>



       <TouchableOpacity
    onPress={() => navigation.navigate("DriverProfile")}
    style={styles.navButton}
  >
    <FontAwesome5 name="user-alt" size={22} color="#004d00" />
    <Text style={styles.footerText}>Profile</Text>
  </TouchableOpacity>
      </View>
    </View>
     </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5e9" },

  headerWrapper: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  curve: {
    position: "absolute",
    top: 0,
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 80,
  },
  headerTextLeft: { color: "#e0f7e9", fontSize: 14, fontWeight: "bold" },
  headerTextRight: { color: "#e0f7e9", fontSize: 14, fontWeight: "bold" },
  subtitle: {
    color: "#071307ff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  title: { color: "white", fontSize: 30, fontWeight: "bold", textAlign: "center", marginTop: -20 },

  image: { width: "100%", height: 230, marginTop: 10, marginBottom: 10 },

  formContainer: {
    alignItems: "center",
    marginTop: -40,
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
    color: "#171817ff",
    textAlignVertical: "top",
  },

  sendButton: {
    width: 160,
    backgroundColor: "#17581bff",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 2,
    elevation: 3,
  },
  sendButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2,fontWeight: "bold" },
 
});

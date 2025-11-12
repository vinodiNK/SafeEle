// app/StationMessage.jsx
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
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
import MessageImage from "../assets/news.png";
import { db } from "../firebaseConfig";

export default function StationMessage() {
  const navigation = useNavigation();
  const [station, setStation] = useState("");
  const [title, setTitle] = useState("");
  const [news, setNews] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSend = async () => {
    if (!station || !title || !news) {
      Alert.alert("Error", "Please fill all fields before sending.");
      return;
    }

    try {
      await addDoc(collection(db, "StationSendNews"), {
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* 🌿 Header */}
          <View style={styles.headerWrapper}>
            <Svg height="90" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
              <Defs>
                <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#4CAF50" />
                  <Stop offset="100%" stopColor="#006400" />
                </SvgGradient>
              </Defs>
              <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
            </Svg>

            <Svg height="175" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
              <Defs>
                <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#4CAF50" />
                  <Stop offset="100%" stopColor="#006400" />
                </SvgGradient>
              </Defs>
              <Path fill="url(#grad)" d="M0,200 C480,80 960,300 1440,200 L1440,0 L0,0 Z" />
            </Svg>

            <Text style={styles.title}>Send Message</Text>
            <Text style={styles.subtitle}>Send updates to Wildlife Department</Text>
          </View>

          {/* 🖼️ Image */}
          <Image source={MessageImage} style={styles.image} resizeMode="contain" />

          {/* 🧾 Form */}
          <View style={styles.formContainer}>
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

            <View style={styles.dropdownContainer}>
              <Picker
                selectedValue={title}
                style={styles.dropdown}
                dropdownIconColor="#004d00"
                onValueChange={(value) => setTitle(value)}
              >
                <Picker.Item label="Title" value="" />
                <Picker.Item label="Elephant Sighting" value="Elephant Sighting" />
                <Picker.Item label="Track Damage" value="Elephant Collision" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            <TextInput
              style={styles.textBox}
              placeholder="Enter Message Here..."
              placeholderTextColor="#004d00"
              value={news}
              onChangeText={setNews}
              multiline
            />

            <View
              style={{
                width: "85%",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 10,
              }}
            >
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 🌿 Footer Navigation */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("index")}
              style={styles.navButton}
            >
              <Entypo name="home" size={22} color="#004d00" />
              <Text style={styles.footerText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("StationViewNews")}
              style={styles.navButton}
            >
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5e9" },

  headerWrapper: { backgroundColor: "transparent", overflow: "hidden" },
  curve: { position: "absolute", top: 0 },
  title: { color: "white", fontSize: 30, fontWeight: "bold", textAlign: "center", marginTop: 40 },
  subtitle: { color: "#071307ff", fontSize: 16, textAlign: "center", marginTop: 40 },

  image: { width: "100%", height: 230, marginTop: 10, marginBottom: 10 },

  formContainer: {
    alignItems: "center",
    marginTop: -20,
    paddingBottom: 100,
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
    marginTop: 12,
    elevation: 3,
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
  },
  navButton: { justifyContent: "center", alignItems: "center" },
  footerText: { color: "#004d00", fontSize: 12, marginTop: 2 },
  footerTextActive: { color: "#2E7D32", fontSize: 12, marginTop: 2, fontWeight: "bold" },
});

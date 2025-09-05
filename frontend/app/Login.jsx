// app/Login.jsx
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
import LoginImage from "../assets/login.jpg"; // use your elephant + train image
import { auth, db } from "../firebaseConfig";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Handle Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch role from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;

        if (role === "driver") {
          navigation.reset({ index: 0, routes: [{ name: "DriverDashboard" }] });
        } else if (role === "station") {
          navigation.reset({ index: 0, routes: [{ name: "StationDashboard" }] });
        } else if (role === "wildlife") {
          navigation.reset({ index: 0, routes: [{ name: "WildlifeDashboard" }] });
        } else {
          Alert.alert("Error", "Role not assigned");
        }
      } else {
        Alert.alert("Error", "No user data found");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top image */}
      <Image source={LoginImage} style={styles.image} resizeMode="cover" />

      {/* Login card */}
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#777"
          value={email}
          onChangeText={(t) => setEmail(t)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={(t) => setPassword(t)}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: "50%" },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    alignItems: "center",
    marginTop: -30, // lift card into image
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d6a4f",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
  },

  input: {
    width: "100%",
    backgroundColor: "#f0f4f3",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 14,
    color: "#000",
  },

  loginButton: {
    width: "100%",
    padding: 15,
    borderRadius: 25,
    backgroundColor: "#2d6a4f",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  loginButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  forgotPassword: { marginTop: 12, color: "#2d6a4f", fontSize: 13 },
});

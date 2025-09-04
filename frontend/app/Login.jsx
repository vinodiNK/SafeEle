import { Ionicons } from "@expo/vector-icons"; // eye icon
import { signInWithEmailAndPassword } from "firebase/auth";
import { child, get, ref } from "firebase/database";
import { useState } from "react";
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
import LoginImage from "../assets/login.jpg";
import { auth, db } from "../firebase";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${userId}/role`));

      if (snapshot.exists()) {
        const userRole = snapshot.val();
        Alert.alert(`Login successful as ${userRole}`);

        if (userRole === "driver") {
          navigation.navigate("DriverDashboard");
        } else if (userRole === "station") {
          navigation.navigate("StationDashboard");
        } else if (userRole === "wildlife") {
          navigation.navigate("WildlifeDashboard");
        } else {
          Alert.alert("Unknown role. Contact admin.");
        }
      } else {
        Alert.alert("No role found for this user");
      }
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image source={LoginImage} style={styles.image} resizeMode="cover" />

          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.loginText}>Login to your account</Text>

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password Input with Eye Icon */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: "60%" },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: "center",
    marginTop: -30,
  },
  welcomeText: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#2d6a4f" },
  loginText: { fontSize: 14, color: "#555", marginBottom: 20 },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eyeButton: {
    padding: 10,
  },
  loginButton: {
    width: "100%",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#2d6a4f",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  forgotPassword: { marginTop: 5, color: "#2d6a4f", fontSize: 13 },
});

// app/SendNews.jsx
import { Image, StyleSheet, Text, View } from "react-native";
import NewsImage from "../assets/news.png"; // ✅ add news.png in your assets folder

export default function SendNews() {
  return (
    <View style={styles.container}>
      {/* Top Image */}
      <Image source={NewsImage} style={styles.image} resizeMode="contain" />

      {/* Title */}
      <Text style={styles.title}>Send News</Text>
      <Text style={styles.subtitle}>
        Share important updates with the station and wildlife officers
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  image: { width: 250, height: 200, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#2d6a4f", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", color: "#555" },
});

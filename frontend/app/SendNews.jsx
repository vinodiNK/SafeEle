// app/SendNews.jsx
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import BackgroundImage from "../assets/Layer.png"; // background image
import NewsImage from "../assets/news.png"; // top illustration

export default function SendNews() {
  return (
    <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        {/* Top Image */}
        <Image source={NewsImage} style={styles.image} resizeMode="contain" />

        {/* Title */}
        <Text style={styles.title}>Send News</Text>
        <Text style={styles.subtitle}>
          Share important updates with the station and wildlife officers
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "50%" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  image: { width: 750, height: 300, marginBottom: 170 },
  title: { fontSize: 34, fontWeight: "bold", color: "#2d6a4f", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", color: "#555" },
});

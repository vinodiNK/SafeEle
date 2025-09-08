// app/SendNews.jsx
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import BackgroundImage from "../assets/Layer.png"; // background image
import NewsImage from "../assets/news.png"; // top illustration

export default function SendNews() {
  return (
    <ImageBackground source={BackgroundImage} style={styles.background} resizeMode="cover">
      {/* Title at the top */}
      <View style={styles.header}>
        <Text style={styles.title}>Send News</Text>
      </View>

      {/* Top Image below title */}
      <View style={styles.container}>
        <Image source={NewsImage} style={styles.image} resizeMode="contain" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "50%" },
  
  header: { 
    width: "100%", 
    paddingTop: 60, 
    paddingLeft: 20,  // ✅ add left padding
    alignItems: "flex-start" // ✅ align text to the left
  },

  title: { 
    fontSize: 34, 
    fontWeight: "bold", 
    color: "rgba(235, 243, 239, 1)" 
  },

  container: { 
    flex: 1, 
    justifyContent: "flex-start", 
    alignItems: "center", 
    paddingTop: 30 
  },

  image: { 
    width: 750, 
    height: 300,
    marginBottom: 180 
  },
});


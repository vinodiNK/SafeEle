// app/SendNews.jsx
import { StyleSheet, Text, View } from "react-native";

export default function SendNews() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send News Page</Text>
      {/* Later you can add form or chat functionality here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#2d6a4f" },
});

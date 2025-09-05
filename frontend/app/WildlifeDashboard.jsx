// app/DriverDashboard.jsx
import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

export default function WildlifeDashboard() {
  const navigation = useNavigation();
  return (
    <View>
      <Text> Wildlife Dashboard</Text>
      <Button title="Logout" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })} />
    </View>
  );
}

// app/DriverDashboard.jsx
import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

export default function StationDashboard() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Station Dashboard</Text>
      <Button title="Logout" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })} />
    </View>
  );
}

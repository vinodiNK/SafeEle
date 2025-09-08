// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import DriverDashboard from "./app/DriverDashboard";
import Index from "./app/index"; // Landing page
import LoginPage from "./app/Login"; // Login screen
import OpenMap from "./app/OpenMap"; // Map screen
import SendNews from "./app/SendNews"; // ✅ new import
import StationDashboard from "./app/StationDashboard";
import UploadLocation from "./app/UploadLocation"; // Location uploader
import WildlifeDashboard from "./app/WildlifeDashboard";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Index"
        screenOptions={{ headerShown: false }}
      >
        {/* Landing Page */}
        <Stack.Screen name="Index" component={Index} />

        {/* Authentication */}
        <Stack.Screen name="Login" component={LoginPage} />

        {/* Dashboards */}
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
        <Stack.Screen name="StationDashboard" component={StationDashboard} />
        <Stack.Screen name="WildlifeDashboard" component={WildlifeDashboard} />

        {/* Map */}
        <Stack.Screen name="OpenMap" component={OpenMap} />

        {/* Extra features */}
        <Stack.Screen name="UploadLocation" component={UploadLocation} />
        <Stack.Screen name="DriverNews" component={SendNews} /> 
        {/* ✅ added SendNews screen */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

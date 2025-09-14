// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";

// Screens
import CollisionZone from "./app/CollisionZone";
import DriverDashboard from "./app/DriverDashboard";
import GuestLocation from "./app/GuestLocation";
import Index from "./app/index"; // Landing page
import LoginPage from "./app/Login"; // Login screen
import OpenMap from "./app/OpenMap"; // Map screen
import SendNews from "./app/SendNews"; // Driver send news
import StationDashboard from "./app/StationDashboard";
import StationViewNews from "./app/StationViewNews";
import TrackTrainScreen from "./app/TrackTrainScreen"; // Track train screen
import UploadLocation from "./app/UploadLocation"; // Location uploader
import ViewReport from "./app/ViewReport";
import WildlifeDashboard from "./app/WildlifeDashboard";

// Notifications helper
import { registerForPushNotificationsAsync } from "./app/notificationHelper";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        try {
          // Send token to backend
          await fetch("http://10.0.2.2:5000/save-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, role: "driver" }),
          });
          console.log("Token sent to backend:", token);
        } catch (err) {
          console.error("Failed to send token:", err);
        }
      }
    };
    setupNotifications();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Index"
        screenOptions={{ headerShown: false }}
      >
        {/* Landing & Auth */}
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Login" component={LoginPage} />

        {/* Dashboards */}
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
        <Stack.Screen name="StationDashboard" component={StationDashboard} />
        <Stack.Screen name="StationViewNews" component={StationViewNews} />
        <Stack.Screen name="TrackTrainScreen" component={TrackTrainScreen} />
        <Stack.Screen name="WildlifeDashboard" component={WildlifeDashboard} />

        {/* Data & Maps */}
        <Stack.Screen name="CollisionZone" component={CollisionZone} />
        <Stack.Screen name="GuestLocation" component={GuestLocation} />
        <Stack.Screen name="ViewReport" component={ViewReport} />
        <Stack.Screen name="OpenMap" component={OpenMap} />
        <Stack.Screen name="UploadLocation" component={UploadLocation} />

        {/* Driver news */}
        <Stack.Screen name="DriverNews" component={SendNews} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

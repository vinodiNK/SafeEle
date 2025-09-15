// app/TrainMap.jsx
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { db } from "../firebaseConfig";

export default function TrainMap({ route }) {
  const { trainId } = route.params; // "yal_devi"
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "trains", trainId), (docSnap) => {
      if (docSnap.exists()) setLocation(docSnap.data());
    });
    return () => unsubscribe();
  }, [trainId]);

  if (!location) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title={location.name}
        />
      </MapView>
    </View>
  );
}

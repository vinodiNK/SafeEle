const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const GOOGLE_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// Elephant function
exports.addElephantLocationName = functions.firestore
  .document("elephants_locations/{docId}")
  .onCreate(async (snap) => {
    const data = snap.data();
    const { latitude, longitude } = data;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const locationName =
        response.data.results[0]?.formatted_address || `${latitude}, ${longitude}`;
      await snap.ref.update({ locationName });
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  });

// Guest function
exports.addGuestLocationName = functions.firestore
  .document("guestLocations/{docId}")
  .onCreate(async (snap) => {
    const data = snap.data();
    const { latitude, longitude } = data;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const locationName =
        response.data.results[0]?.formatted_address || `${latitude}, ${longitude}`;
      await snap.ref.update({ locationName });
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  });

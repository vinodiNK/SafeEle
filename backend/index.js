const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch"); // for sending push notifications

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔥 initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // download from Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com",
});

const db = admin.firestore();

// Temporary in-memory store for push tokens (later you can store in Firestore)
let driverTokens = {};

/**
 * POST /report-elephant
 * Save elephant location in Firestore
 */
app.post("/report-elephant", async (req, res) => {
  try {
    const { latitude, longitude, reporter } = req.body;
    await db.collection("elephant_locations").add({
      latitude,
      longitude,
      reporter: reporter || "guest",
      timestamp: new Date(),
    });
    res.status(200).send({ message: "Elephant location saved" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * POST /driver-location
 * Save driver location in Firestore
 */
app.post("/driver-location", async (req, res) => {
  try {
    const { driverId, latitude, longitude } = req.body;
    await db.collection("driver_locations").doc(driverId).set({
      latitude,
      longitude,
      timestamp: new Date(),
    });
    res.status(200).send({ message: "Driver location updated" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * POST /save-token
 * Save driver push token
 */
app.post("/save-token", (req, res) => {
  const { driverId, token } = req.body;
  if (!driverId || !token) {
    return res.status(400).send({ error: "driverId and token required" });
  }
  driverTokens[driverId] = token;
  console.log(`✅ Saved token for ${driverId}: ${token}`);
  res.send({ message: "Token saved successfully" });
});

/**
 * GET /elephants
 * Return all elephant locations
 */
app.get("/elephants", async (req, res) => {
  try {
    const snapshot = await db.collection("elephant_locations").get();
    const elephants = snapshot.docs.map((doc) => doc.data());
    res.status(200).send(elephants);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * POST /send-test-notification
 * Send a test push notification to a driver
 */
app.post("/send-test-notification", async (req, res) => {
  const { driverId, message } = req.body;
  const token = driverTokens[driverId];

  if (!token) {
    return res.status(404).send({ error: "No token found for this driver" });
  }

  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token,
        sound: "default",
        title: "⚠️ Test Alert",
        body: message || "This is a test notification",
      }),
    });

    res.send({ message: "Notification sent successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Store news temporarily (later connect to Firestore with Admin SDK)
let news = [];

app.post("/news", (req, res) => {
  const { station, title, newsText } = req.body;

  if (!station || !title || !newsText) {
    return res.status(400).json({ error: "All fields required" });
  }

  const newEntry = {
    id: Date.now(),
    station,
    title,
    news: newsText,
    createdAt: new Date().toISOString(),
  };

  news.push(newEntry);
  console.log("✅ News added:", newEntry);

  res.status(201).json({ message: "News saved", data: newEntry });
});

app.get("/news", (req, res) => {
  res.json(news);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Backend running on http://192.168.101.174:${PORT}`));

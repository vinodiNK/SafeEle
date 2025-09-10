const express = require("express");
const cors = require("cors");
const stationRoutes = require("./routes/stationRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/stations", stationRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Sri Lanka Railway Stations API running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

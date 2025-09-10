const fs = require("fs");
const path = require("path");

class Station {
  constructor() {
    this.stations = [];
    this.loadStations();
  }

  loadStations() {
    const filePath = path.join(__dirname, "../data/stations.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Failed to load stations:", err);
      } else {
        this.stations = JSON.parse(data);
      }
    });
  }

  getAll() {
    return this.stations;
  }

  getById(id) {
    return this.stations.find((station) => station.id === id);
  }
}

module.exports = new Station();

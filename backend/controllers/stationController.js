const Station = require("../models/Station");

const getStations = (req, res) => {
  const stations = Station.getAll();
  res.json(stations);
};

module.exports = {
  getStations,
};

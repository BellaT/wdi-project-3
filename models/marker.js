var mongoose = require("mongoose");

var markerSchema = mongoose.Schema({
  image: String,
  lat: String,
  lng: String
});

module.exports = mongoose.model("Marker", markerSchema);
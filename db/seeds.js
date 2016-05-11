var mongoose = require("mongoose");

var databaseURL = 'mongodb://localhost:27017/zombie';
mongoose.connect(databaseURL);

var Marker = require("../models/marker"); 
var User    = require("../models/user");

var newYork = new Marker({
  image: "./photos/zombie1.jpg",
  lat: "40.7128",
  lng: "-74.0059"
})

newYork.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var greece = new Marker({
  image: "./photos/zombie10.jpg",
  lat: "40.875221",
  lng: "22.417422"
})

greece.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var buenosAires = new Marker({
  image: "./photos/zombie2.jpg",
  lat: "-34.622474",
  lng: "-58.436486"
})

buenosAires.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var romania = new Marker({
  image: "./photos/zombie22.jpg",
  lat: "44.403296",
  lng: "26.127261"
})

romania.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var japan = new Marker({
  image: "./photos/zombie23.jpg",
  lat: "39.413985",
  lng: "140.881639"
})

japan.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

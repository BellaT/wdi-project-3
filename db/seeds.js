var mongoose = require("mongoose");

var databaseURL = 'mongodb://localhost:27017/zombie';
mongoose.connect(databaseURL);

var Marker = require("../models/marker"); 
var User    = require("../models/user");

var marker1 = new Marker({
  image: "./photos/zombie1.jpg",
  lat: "40.7128",
  lng: "-74.0059"
})

marker1.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var marker2 = new Marker({
  image: "./photos/zombie10.jpg",
  lat: "40.875221",
  lng: "22.417422"
})

marker2.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

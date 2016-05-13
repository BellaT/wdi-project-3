var mongoose = require("mongoose");
var config   = require("../config/config")

mongoose.connect(config.database);

var Marker = require("../models/marker"); 
var User    = require("../models/user");

Marker.collection.drop();

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

var austria = new Marker({
  image: "./photos/zombie22.jpg",
  lat: "48.288208",
  lng: "16.256555"
})

austria.save(function(err, marker) {
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

var california = new Marker({
  image: "./photos/zombie24.jpg",
  lat: "36.632449",
  lng: "-121.701371"
})

california.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var glastonbury = new Marker({
  image: "./photos/zombie7.jpg",
  lat: "51.156002",
  lng: "-2.586359"
})

glastonbury.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var london = new Marker({
  image: "./photos/zombie_11.jpg",
  lat: "51.514942",
  lng: "-0.089627"
})

london.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var capetown = new Marker({
  image: "./photos/zombie5.jpg",
  lat: "-33.869025",
  lng: "18.676261"
})

capetown.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var kazakhstan = new Marker({
  image: "./photos/zombie4.jpg",
  lat: "51.288677",
  lng: "71.537695"
})

kazakhstan.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var canada = new Marker({
  image: "./photos/zombie21.jpg",
  lat: "53.580015",
  lng: "-113.531063"
})

canada.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var germany = new Marker({
  image: "./photos/zombie25.jpg",
  lat: "52.534084",
  lng: "13.421209"
})

germany.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var sweden = new Marker({
  image: "./photos/zombie8.png",
  lat: "66.593239",
  lng: "19.890177"
})

sweden.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var chicago = new Marker({
  image: "./photos/zombie6.jpg",
  lat: "41.837484",
  lng: "-87.691002"
})

chicago.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})

var india = new Marker({
  image: "./photos/zombie26.jpg",
  lat: "19.158408",
  lng: "73.219123"
})

india.save(function(err, marker) {
 if (err) return console.log(err);
 console.log("Marker saved! ", marker);
})
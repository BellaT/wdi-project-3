var TrailApp = TrailApp || {}

TrailApp.setRequestHeader = function(xhr, settings) {
  var token = TrailApp.getToken();
  if (token) return xhr.setRequestHeader("Authorization", "Bearer " + token);
}

TrailApp.getToken = function() {
  return window.localStorage.getItem("token");
}

TrailApp.setToken = function(token) {
  return window.localStorage.setItem("token", token);
}

TrailApp.saveTokenIfPresent = function(data) {
  if (data.token) return this.setToken(data.token);
  return false;
}

TrailApp.ajaxRequest = function(method, url, data) {
  $.ajax({
    method: method,
    url: "http://localhost:3000/api" + url,
    data: data,
    beforeSend: this.setRequestHeader
  }).done(function(data) {
    console.log(data);
    TrailApp.saveTokenIfPresent(data);
  }).fail(function(data) {
    console.log(data.responseJSON.message);
  });
}

TrailApp.submitForm = function() {
  event.preventDefault();

  var method = $(this).attr('method');
  var url    = $(this).attr('action');
  var data   = $(this).serialize();

  return TrailApp.ajaxRequest(method, url, data);
}

TrailApp.getUsers = function() {
  return TrailApp.ajaxRequest("get", "/users");
}

TrailApp.setupGoogleMaps = function(){
  this.canvas = document.getElementById('map-canvas');

  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(51.5074, 0.1278),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [[{"featureType":"landscape","stylers":[{"hue":"#FFA800"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#53FF00"},{"saturation":-73},{"lightness":40},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FBFF00"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#00FFFD"},{"saturation":0},{"lightness":30},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00BFFF"},{"saturation":6},{"lightness":8},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#679714"},{"saturation":33.4},{"lightness":-25.4},{"gamma":1}]}]]
  }

  this.map = new google.maps.Map(this.canvas, mapOptions);
}

TrailApp.trailRequest = function() {
  $.ajax({
    method: "GET",
    url: "https://trailapi-trailapi.p.mashape.com/?q[country_cont]=Australia",
    beforeSend: this.setTrailHeader
  }).done(function(data) {
    console.log(data);
  }).fail(function(data) {
    console.log(data.responseJSON.message);
  })
}

TrailApp.setTrailHeader = function(xhr, settings) {
  return xhr.setRequestHeader("X-Mashape-Key", "dRMIUG9qocmshKWGh0LwPHR1omzNp1olRuejsnYcUnn1htHxkP");
}

TrailApp.getTemplate = function(tpl, data) {
  var templateUrl = "http://localhost:3000/templates/" + tpl + ".html";

  $.ajax({
    url: templateUrl,
    method: "GET",
    dataType: "html"
  }).done(function(templateData){
    var parsedTemplate = _.template(templateData);
    var compliedTemplate = parsedTemplate(data);
    $("main").empty().append(compliedTemplate);
  });
}

TrailApp.changePage = function() {
  event.preventDefault();
  var tpl = $(this).data("template");
  TrailApp.getTemplate(tpl, null);
}

TrailApp.setupNavigation = function() {
  $("header nav a").on("click", this.changePage);
}

TrailApp.initialize = function(){
  // $('form').on('submit', this.submitForm);
  // $('#getUsers').on('click', this.getUsers);
  this.setupGoogleMaps();
  // this.trailRequest();
  this.setupNavigation();
}

$(function(){
  TrailApp.initialize();
})
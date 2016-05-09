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
    TrailApp.saveTokenIfPresent(data)
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
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  this.map = new google.maps.Map(this.canvas, mapOptions);
}

TrailApp.initialize = function(){
  $('form').on('submit', this.submitForm);
  $('#getUsers').on('click', this.getUsers);
  this.setupGoogleMaps();
}

$(function(){
  TrailApp.initialize();
})
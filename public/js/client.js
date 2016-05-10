var Zombie = Zombie || {}

Zombie.setRequestHeader = function(xhr, settings) {
  var token = Zombie.getToken();
  if (token) return xhr.setRequestHeader("Authorization", "Bearer " + token);
}

Zombie.getToken = function() {
  return window.localStorage.getItem("token");
}

Zombie.setToken = function(token) {
  return window.localStorage.setItem("token", token);
}

Zombie.saveTokenIfPresent = function(data) {
  if (data.token) return this.setToken(data.token);
  return false;
}

Zombie.ajaxRequest = function(method, url, data) {
  $.ajax({
    method: method,
    url: "http://localhost:3000/api" + url,
    data: data,
    beforeSend: this.setRequestHeader
  }).done(function(data) {
    console.log(data);
    Zombie.saveTokenIfPresent(data);
  }).fail(function(data) {
    console.log(data.responseJSON.message);
  });
}

Zombie.submitForm = function() {
  event.preventDefault();
  console.log("here")

  var method = $(this).attr('method');
  var url    = $(this).attr('action');
  var data   = $(this).serialize();

  Zombie.ajaxRequest(method, url, data);
  return Zombie.getTemplate("home", null);
}

Zombie.getUsers = function() {
  return Zombie.ajaxRequest("get", "/users");
}

Zombie.setupGoogleMaps = function(){
  this.canvas = document.getElementById('map-canvas');

  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(51.5074, 0.1278),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [[{"featureType":"landscape","stylers":[{"hue":"#FFA800"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#53FF00"},{"saturation":-73},{"lightness":40},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FBFF00"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#00FFFD"},{"saturation":0},{"lightness":30},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00BFFF"},{"saturation":6},{"lightness":8},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#679714"},{"saturation":33.4},{"lightness":-25.4},{"gamma":1}]}]]
  }

  this.map = new google.maps.Map(this.canvas, mapOptions);
  // this.getService({ lat: 51.5074, lng: 0.1278 }, "hospital");
  // this.getService({ lat: 51.5074, lng: 0.1278 }, "hardware_store");
}

Zombie.getTemplate = function(tpl, data) {
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

Zombie.changePage = function() {
  event.preventDefault();
  var tpl = $(this).data("template");
  Zombie.getTemplate(tpl, null);
}

Zombie.setupNavigation = function() {
  $("header nav a").on("click", this.changePage);
}

Zombie.setupForm = function() {
  $('#search').on('submit', this.getLocation);
}

Zombie.getLocation = function() {
  // event.preventDefault();
  var location = $("#pac-input").val();
  console.log(location)
  $.ajax({
    url:"http://maps.googleapis.com/maps/api/geocode/json?address="+location+"&sensor=false",
    type: "POST",
    success:function(res){
     var LatLng = { 
      lat: res.results[0].geometry.location.lat,
      lng: res.results[0].geometry.location.lng
    }
    Zombie.getService(LatLng, ["hospital"]);
  }
})
}

Zombie.getService = function(LatLng, type) {
  var service = new google.maps.places.PlacesService(Zombie.map);
  service.nearbySearch({
    location: LatLng,
    radius: 50000,
    type: type
  }, Zombie.processResults);
}

Zombie.processResults = function(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    return;
  } else {
    Zombie.createMarkers(results);
  }
}

Zombie.createMarkers = function(places) {
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0, place; place = places[i]; i++) {
    console.log(place.icon)
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: Zombie.map,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });

    bounds.extend(place.geometry.location);
  }
  Zombie.map.fitBounds(bounds);
}

Zombie.autocomplete = function() {
  var map = Zombie.map 
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      // map.fitBounds(bounds);
      Zombie.getLocation();
    });
  }

Zombie.initialize = function(){
  // $('#getUsers').on('click', this.getUsers);
  this.setupGoogleMaps();
  this.setupNavigation();
  this.setupForm();
  this.autocomplete();

}

$(function(){
  Zombie.initialize();
})
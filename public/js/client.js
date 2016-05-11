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
  return $.ajax({
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

  var method = $(this).attr('method');
  var url    = $(this).attr('action');
  var data   = $(this).serialize();

  Zombie.ajaxRequest(method, url, data);
  return Zombie.getTemplate("home", null);
}

Zombie.getUsers = function() {
  return Zombie.ajaxRequest("get", "/users");
}

Zombie.iconTypes = [
"airport",
"campground",
"hospital",
"hardware_store",
"pharmacy",
"doctor",
"police"
]

Zombie.setupGoogleMaps = function(){
  this.canvas = document.getElementById('map-canvas');

  var mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(28.0339, -15.5678),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}],
    mapTypeControl: false,
    minZoom: 2
  }

  this.map = new google.maps.Map(this.canvas, mapOptions);

  var citymap = {
    london: {
      center: {lat: 51.500152, lng: -0.126236},
      population: 1549123
    },
    chicago: {
      center: {lat: 41.878, lng: -87.629},
      population: 2714856
    },
    newyork: {
      center: {lat: 40.714, lng: -74.005},
      population: 8405837
    },
    losangeles: {
      center: {lat: 34.052, lng: -118.243},
      population: 3857799
    },
    vancouver: {
      center: {lat: 49.25, lng: -123.1},
      population: 603502
    },
    Mumbai: {
      center: {lat: 19.0760, lng: 72.8777},
      population: 13467235
    },
    Cairo: {
      center: {lat: 30.0444, lng: 31.2357},
      population: 158592355
    },
    Patient_0: {
      center: {lat: -14.2350, lng: -51.9253},
      population: 1532453452
    },
    Wuhan: {
      center: {lat: 30.3054, lng: 113.4112},
      population: 234090983
    },
    Argentina: {
      center: {lat: -30.2350, lng: -60.9253},
      population: 153245345.5
    },
    Paris: {
      center: {lat: 48.8566, lng: 2.3522},
      population: 5532434
    },
    Milan: {
      center: {lat: 45.460053, lng: 9.225066},
      population: 55524349
    },
    island: {
      center: {lat: -49.450071, lng: 69.464789},
      population: 65324
    },
    MexicoCity: {
      center: {lat: 20.6345, lng: -102.5528},
      population: 65324798,
    },
    Melbourne: {
      center: {lat: -37.671812, lng: 145.036239},
      population: 95324798,
    },
    PortElizabeth: {
      center: {lat: -28.765319, lng: 30.493061},
      population: 9532417,
    },
    Ntoto: {
      center: {lat: -1.880540, lng: 28.574132},
      population: 199999899,
    },
    Ghana: {
      center: {lat: 6.289979, lng: 0.820303},
      population: 84930387,
    },
    Barcelona: {
      center: {lat: 41.408675, lng: 2.115806},
      population: 19969501,
    },
    Palmyra: {
      center: {lat: 34.186014, lng: 39.019998},
      population: 9532479,
    },
  };

  for (var city in citymap) {
    var cityCircle = new google.maps.Circle({
      strokeColor: 'rgb(155, 0, 0)',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'rgb(84, 12, 4)',
      fillOpacity: 0.65,
      map: Zombie.map,
      center: citymap[city].center,
      radius: Math.sqrt(citymap[city].population) * 25,
      icon: "/zombie-project/zombie-outbreak.png",
    });
  }
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
    $("main").html(compliedTemplate);
  });
}

Zombie.changePage = function() {
  event.preventDefault();
  var tpl = $(this).data("template");
  if (tpl) Zombie.getTemplate(tpl, null);
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
  
  return $.ajax({
    url:"http://maps.googleapis.com/maps/api/geocode/json?address="+location+"&sensor=false",
    type: "POST",
    success:function(res){
      var LatLng = { 
        lat: res.results[0].geometry.location.lat,
        lng: res.results[0].geometry.location.lng
      }

      Zombie.iconTypes.forEach(function(type) {
        Zombie.getService(LatLng, type);
      });
    }
  });
}

Zombie.getService = function(LatLng, type) {
  var service = new google.maps.places.PlacesService(Zombie.map);
  
  service.nearbySearch({
    location: LatLng,
    radius: 50000,
    type: [type]
  }, Zombie.processResults);
}

Zombie.processResults = function(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    return;
  } else {
    return Zombie.createMarkers(results);
  }
}

Zombie.createMarkers = function(places) {
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0, place; place = places[i]; i++) {
    var image = {
      url: "../zombie-project/" + place.types[0] + ".png",
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

    var contentString = '<p>' + place.name + '</p>';

    Zombie.addInfoWindow(marker, contentString);
    bounds.extend(place.geometry.location);
  }
  Zombie.map.fitBounds(bounds);
}

Zombie.addInfoWindow = function(marker, contentString) {
  var infoWindow = new google.maps.InfoWindow({
    content: contentString
  });

  marker.addListener("mouseover", function(){
    infoWindow.open(Zombie.map, this);
  });

  marker.addListener("mouseout", function(){
    infoWindow.close();
  });
}

Zombie.autocomplete = function() {
  var map = Zombie.map 
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) return;

    markers.forEach(function(marker) {
      marker.setMap(null);
    });

    markers = [];

    var bounds = new google.maps.LatLngBounds();
    
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    Zombie.getLocation();
  });
}

Zombie.styleInfoBox = function() {
  // cancelButton.css("display", "none");
}

Zombie.createFakeMarker = function() {
  var newYork = {lat: 40.7128, lng: -74.0059};

  var contentString = "<img src='./photos/zombie1.jpg' class='image'>";

  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 400,
    maxHeight: 400, 
    backgroundColor: 'black'
  });

  var marker = new google.maps.Marker({
    icon: "./zombie-project/zombie-outbreak.png",
    position: newYork,
    map: Zombie.map,
    title: 'New York',
  });
  marker.addListener('click', function() {
    infowindow.open(Zombie.map, marker);
    return (function() {
      var $iwOuter = $(".gm-style-iw");
      $iwOuter.next("div").css({
       'border': '7px solid #790000',
       'border-radius': '100%' 
      });
      $iwOuter.prev().find("*").css("background-color", "rgba(0,0,0,0.5)");
    })();
  }); 
}

Zombie.setupSidebar = function() {
  var trigger = $('.hamburger'),
  overlay = $('.overlay'),
  isClosed = false;

  trigger.click(function () {
    hamburger_cross();      
  });

  function hamburger_cross() {
    if (isClosed == true) {          
      overlay.hide();
      trigger.removeClass('is-open');
      trigger.addClass('is-closed');
      isClosed = false;
    } else {   
      overlay.show();
      trigger.removeClass('is-closed');
      trigger.addClass('is-open');
      isClosed = true;
    }
  }
  
  $('[data-toggle="offcanvas"]').click(function () {
    $('#wrapper').toggleClass('toggled');
  });
}

Zombie.initialize = function() {
  this.setupSidebar();
  this.setupGoogleMaps();
  this.setupNavigation();
  this.setupForm();
  this.autocomplete();
  this.createFakeMarker();
  this.styleInfoBox();
}

$(function(){
  Zombie.initialize();
})
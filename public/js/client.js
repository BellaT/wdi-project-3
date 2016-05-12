var Zombie = Zombie || {}

Zombie.map;
Zombie.pointarray
Zombie.heatmap;
Zombie.csv = [];
Zombie.infowindow;
Zombie.isClosed = false;
Zombie.loaded = false;
Zombie.number = 5438784;


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
    backgroundColor: "#545454",
    zoom: 2,
    center: new google.maps.LatLng(28.0339, -15.5678),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"all","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":"-100"},{"invert_lightness":true},{"lightness":"11"},{"gamma":"1.27"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"hue":"#ff0000"},{"visibility":"simplified"},{"invert_lightness":true},{"lightness":"-10"},{"gamma":"0.54"},{"saturation":"45"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#ff0000"},{"saturation":"75"},{"lightness":"24"},{"gamma":"0.70"},{"invert_lightness":true}]},{"featureType":"poi.government","elementType":"all","stylers":[{"hue":"#ff0000"},{"visibility":"simplified"},{"invert_lightness":true},{"lightness":"-24"},{"gamma":"0.59"},{"saturation":"59"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"simplified"},{"invert_lightness":true},{"hue":"#ff0000"},{"saturation":"73"},{"lightness":"-24"},{"gamma":"0.59"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"lightness":"-41"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#ff0000"},{"invert_lightness":true},{"saturation":"43"},{"lightness":"-16"},{"gamma":"0.73"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"hue":"#ff0000"},{"saturation":"43"},{"lightness":"-11"},{"gamma":"0.73"},{"invert_lightness":true}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"45"},{"lightness":"53"},{"gamma":"0.67"},{"invert_lightness":true},{"hue":"#ff0000"},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#ff0000"},{"saturation":"38"},{"lightness":"-16"},{"gamma":"0.86"}]}],
    disableDefaultUI: true,
    minZoom: 2
  }
  this.map = new google.maps.Map(this.canvas, mapOptions);
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
    if (tpl == "videos") {
      Zombie.getVideos();
    } else if (tpl == "home") {
      Zombie.showMarquee();
      Zombie.setupGoogleMaps();
      Zombie.autocomplete();
      Zombie.requestFakeMarkers();
      Zombie.setupHeatmap();
      Zombie.getDate();
      if (!Zombie.loaded) {
        Zombie.setupModal();
        Zombie.loaded = true;
      }
    }
  });
}

Zombie.changePage = function() {
  event.preventDefault();
  var tpl = $(this).data("template");
  console.log(tpl)
  if (tpl) Zombie.getTemplate(tpl, null);
  Zombie.hamburger_cross();
  Zombie.toggleSidebar();
}

Zombie.setupNavigation = function() {
  $("#videos").on('click', this.changePage);
  $("#home").on('click', this.changePage);
  $("#tips").on('click', this.changePage);
  $("#shopping").on('click', this.changePage);
  $("#infections").on('click', this.changePage);
}

Zombie.setupForm = function() {
  $('#search').on('submit', this.getLocation);
}

Zombie.getLocation = function() {
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
      url: "../images/" + place.types[0] + ".png",
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: Zombie.map,
      icon: image,
      title: place.name,
      position: place.geometry.location,
      animation: google.maps.Animation.DROP
    }); 

    var contentString = '<p>' + place.name + '</p>';

    Zombie.addInfoWindow(marker, contentString);
    bounds.extend(place.geometry.location);
  }
  Zombie.map.fitBounds(bounds);
}

Zombie.addInfoWindow = function(marker, contentString) {
  var infoWindow = new google.maps.InfoWindow({
    content: contentString,
    pixelOffset: new google.maps.Size(-24, 8)
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
        anchor: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(25, 25)
      };

      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
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

Zombie.createFakeMarkers = function(image, lat, lng, timeout){
  lat = parseFloat(lat)
  lng = parseFloat(lng)

  var city = { lat: lat, lng: lng };

  var contentString = "<img src='" + image + "' class='image'>";

  window.setTimeout(function(){
    var marker = new google.maps.Marker({
      icon: "./images/zombie-outbreak.png",
      position: city,
      map: Zombie.map,
      animation: google.maps.Animation.DROP
    });

    marker.addListener('click', function() {
      if (typeof Zombie.infowindow !== "undefined") Zombie.infowindow.close();

      Zombie.infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400,
        maxHeight: 400, 
        backgroundColor: 'black'
      });

      Zombie.infowindow.open(Zombie.map, marker);

      google.maps.event.addListener(Zombie.infowindow, 'domready', function() { 
        $(".gm-style-iw").hide();
        var $iwOuter = $(".gm-style-iw");
        var $x       = $iwOuter.next("div");
        var $bg      = $iwOuter.prev().find("*");

        $x.css({
          'border': '7px solid #790000',
          'border-radius': '100%' 
        });

        $bg.css({
          "background-color": "rgba(0,0,0,0.2)",
          "border-radius": "10px"
        });
        $(".gm-style-iw").fadeIn();
      });
    }); 
  }, timeout);
}

Zombie.loopThroughFakeMarkers = function(markers) {
  $.each(markers, function(i, marker) {
    $.each(marker, function(i, marker) { 

      var image = marker.image;
      var lat   = marker.lat;
      var lng   = marker.lng;
      Zombie.createFakeMarkers(image, lat, lng, ((i)*500));
    });
  });
}

Zombie.requestFakeMarkers = function() {
  $.ajax({
    url: "http://localhost:3000/api/markers",
    method: "GET"
  }).done(function(data){
    Zombie.loopThroughFakeMarkers(data);
  })
}

Zombie.toggleSidebar = function() {
  $('#wrapper').removeClass('toggled');
}

Zombie.hamburger_cross = function() {
  var trigger = $('.hamburger');
  var overlay = $('.overlay');

  if (Zombie.isClosed == true) {          
    overlay.hide();
    trigger.removeClass('is-open');
    trigger.addClass('is-closed');
    Zombie.isClosed = false;
  } else {   
    overlay.show();
    trigger.removeClass('is-closed');
    trigger.addClass('is-open');
    Zombie.isClosed = true;
  }
}

Zombie.setupSidebar = function() {
  var trigger = $('.hamburger');

  trigger.click(function() {
    Zombie.hamburger_cross();      
  });
  $('[data-toggle="offcanvas"]').click(function() {
    $('#wrapper').toggleClass('toggled');
  });
}

Zombie.setupModal = function() {
  $("#story-modal").modal('show')
  .velocity("fadeIn", { duration: 3000 } );
}

Zombie.appendVideos = function(data) {
  var videos = data.items;
  var $container = $("#videos-container");

  $(videos).each(function(index) {
    var video = videos[index]
    var content =
    '<div class="col-md-4">' +
    '<div class="thumbnail">' +
    '<div class="embed-responsive embed-responsive-16by9">'+
    '<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' +  video.id.videoId + '" frameborder="0" allowfullscreen></iframe>' +
    '<div class="caption">' +
    '<h3>'+ video.snippet.title +'</h3>' +
    '<p>'+ video.snippet.description +'</p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';

    $container.append(content);
  });
}

Zombie.getVideos = function() {
  $.ajax({
    type: "GET",
    url: "https://www.googleapis.com/youtube/v3/search?q=how%20to%20survive%20a%20zombie%20apocalypse&part=snippet&key=AIzaSyBmSnOYNMjiBbTYQQvePVvUApeatpNOXM0&maxResults=9"
  }).done(function(data) {
    Zombie.appendVideos(data);
  });
}

Zombie.loadHome = function() {
  this.getTemplate("home", null);
}

Zombie.handleFile = function(file) {
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      Zombie.csv = [];
      if(results.meta.fields.indexOf("weight") == -1) {
        for(idx in results["data"]) {
          var row = results["data"][idx];
          Zombie.csv.push(new google.maps.LatLng(row["lat"], row["lon"]))
        }
      } else {
        var max = results["data"][0]["weight"];
        for(idx in results["data"]) {
          var row = results["data"][idx];
          max = Math.max(max, row["weight"]);
          Zombie.csv.push({
            location: new google.maps.LatLng(row["lat"], row["lon"]),
            weight: row["weight"]
          });
        }
      }
      Zombie.loadHeatmap();
    }
  });
}

Zombie.loadHeatmap = function() {
  var pointArray = new google.maps.MVCArray(Zombie.csv);

  // Clear the heatmap
  if (Zombie.heatmap) Zombie.heatmap.setMap(null);
  
  // Create the heatmap
  Zombie.heatmap = new google.maps.visualization.HeatmapLayer({
    data: pointArray,
    // radius: 50, 
    // opacity: 1,  
    // maxIntensity: 1253000
    radius: 1, 
    opacity: 1,  
    maxIntensity: 125300
  });
  
  Zombie.heatmap.setMap(Zombie.map);
}

Zombie.setupHeatmap = function(){
  return $.ajax({
    type: "GET",
    url: "/data/population.csv",
    dataType: "text"
  }).done(Zombie.handleFile)
}

Zombie.toggleSound = function() {
  var audioElem = document.getElementById('audio');
  if (audioElem.paused)
    audioElem.play();
  else
    audioElem.pause();
}

Zombie.setupAudio = function() {
  var $player = $('#player');
  $player.on('click', Zombie.toggleSound);
}

Zombie.playStaticAudio = function() {
  var staticAudio = document.getElementById("staticAudio");
  staticAudio.play();
}

Zombie.setupStaticTv = function() {
  this.playStaticAudio();
  var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');

  // closer to analouge appearance
  canvas.width = canvas.height = 360;

  function resize() {
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.onresize = resize;

  function noise(ctx) {

    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var idata = ctx.createImageData(width, height);
    var buffer32 = new Uint32Array(idata.data.buffer);
    

    for(var i = 0; i < buffer32.length; i++) 
      if (Math.random() < 0.5) buffer32[i] = 0xff000000;
    ctx.putImageData(idata, 0, 0);
  }

  var toggle = true;
  // added toggle to get 30 FPS instead of 60 FPS
  (function loop() {
    toggle = !toggle;
    if (toggle) {
      requestAnimationFrame(loop);
      return;
    }
    noise(ctx);
    requestAnimationFrame(loop);
  })();
}
Zombie.showMarquee = function() {
  $("marquee").show();
}

Zombie.getDate = function() {
  var today = new Date();
  document.getElementById('time').innerHTML = today;
}

Zombie.count = function() {
  document.getElementById('counter').innerHTML = Zombie.number;
  Zombie.number++; 
}

Zombie.initialize = function() {
  this.loadHome();
  this.setupSidebar();
  this.setupNavigation();
  this.setupForm();
  this.setupAudio();

  setInterval('Zombie.count()', 80);
}

$(function(){
  Zombie.setupStaticTv();
  window.setTimeout(function() {
    Zombie.initialize();
  }, 500)
})
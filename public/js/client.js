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
    zoom: 3,
    center: new google.maps.LatLng(28.0339, 1.6596),
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
    }
  };

  for (var city in citymap) {
    // Add the circle for this city to the map.
    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: Zombie.map,
      center: citymap[city].center,
      radius: Math.sqrt(citymap[city].population) * 25
    });
  }

  var heatmapData = [
    new google.maps.LatLng(37.782551, -122.445368),
    new google.maps.LatLng(37.782745, -122.444586),
    new google.maps.LatLng(37.782842, -122.443688),
    new google.maps.LatLng(37.782919, -122.442815),
    new google.maps.LatLng(37.782992, -122.442112),
    new google.maps.LatLng(37.783100, -122.441461),
    new google.maps.LatLng(37.783206, -122.440829),
    new google.maps.LatLng(37.783273, -122.440324),
    new google.maps.LatLng(37.783316, -122.440023),
    new google.maps.LatLng(37.783357, -122.439794),
    new google.maps.LatLng(37.783371, -122.439687),
    new google.maps.LatLng(37.783368, -122.439666),
    new google.maps.LatLng(37.783383, -122.439594),
    new google.maps.LatLng(37.783508, -122.439525),
    new google.maps.LatLng(37.783842, -122.439591),
    new google.maps.LatLng(37.784147, -122.439668),
    new google.maps.LatLng(37.784206, -122.439686),
    new google.maps.LatLng(37.784386, -122.439790),
    new google.maps.LatLng(37.784701, -122.439902),
    new google.maps.LatLng(37.784965, -122.439938),
    new google.maps.LatLng(37.785010, -122.439947),
    new google.maps.LatLng(37.785360, -122.439952),
    new google.maps.LatLng(37.785715, -122.440030),
    new google.maps.LatLng(37.786117, -122.440119),
    new google.maps.LatLng(37.786564, -122.440209),
    new google.maps.LatLng(37.786905, -122.440270),
    new google.maps.LatLng(37.786956, -122.440279),
    new google.maps.LatLng(37.800224, -122.433520),
    new google.maps.LatLng(37.800155, -122.434101),
    new google.maps.LatLng(37.800160, -122.434430),
    new google.maps.LatLng(37.800378, -122.434527),
    new google.maps.LatLng(37.800738, -122.434598),
    new google.maps.LatLng(37.800938, -122.434650),
    new google.maps.LatLng(37.801024, -122.434889),
    new google.maps.LatLng(37.800955, -122.435392),
    new google.maps.LatLng(37.800886, -122.435959),
    new google.maps.LatLng(37.800811, -122.436275),
    new google.maps.LatLng(37.800788, -122.436299),
    new google.maps.LatLng(37.800719, -122.436302),
    new google.maps.LatLng(37.800702, -122.436298),
    new google.maps.LatLng(37.800661, -122.436273),
    new google.maps.LatLng(37.800395, -122.436172),
    new google.maps.LatLng(37.800228, -122.436116),
    new google.maps.LatLng(37.800169, -122.436130),
    new google.maps.LatLng(37.800066, -122.436167),
    new google.maps.LatLng(37.784345, -122.422922),
    new google.maps.LatLng(37.784389, -122.422926),
    new google.maps.LatLng(37.784437, -122.422924),
    new google.maps.LatLng(37.784746, -122.422818),
    new google.maps.LatLng(37.785436, -122.422959),
    new google.maps.LatLng(37.786120, -122.423112),
    new google.maps.LatLng(37.786433, -122.423029),
    new google.maps.LatLng(37.786631, -122.421213),
    new google.maps.LatLng(37.786660, -122.421033),
    new google.maps.LatLng(37.786801, -122.420141),
    new google.maps.LatLng(37.786823, -122.420034),
    new google.maps.LatLng(37.786831, -122.419916),
    new google.maps.LatLng(37.787034, -122.418208),
    new google.maps.LatLng(37.787056, -122.418034),
    new google.maps.LatLng(37.787169, -122.417145),
    new google.maps.LatLng(37.787217, -122.416715),
    new google.maps.LatLng(37.786144, -122.416403),
    new google.maps.LatLng(37.785292, -122.416257),
    new google.maps.LatLng(37.780666, -122.390374),
    new google.maps.LatLng(37.780501, -122.391281),
    new google.maps.LatLng(37.780148, -122.392052),
    new google.maps.LatLng(37.780173, -122.391148),
    new google.maps.LatLng(37.780693, -122.390592),
    new google.maps.LatLng(37.781261, -122.391142),
    new google.maps.LatLng(37.781808, -122.391730),
    new google.maps.LatLng(37.782340, -122.392341),
    new google.maps.LatLng(37.782812, -122.393022),
    new google.maps.LatLng(37.783300, -122.393672),
    new google.maps.LatLng(37.783809, -122.394275),
    new google.maps.LatLng(37.784246, -122.394979),
    new google.maps.LatLng(37.784791, -122.395958),
    new google.maps.LatLng(37.785675, -122.396746),
    new google.maps.LatLng(37.786262, -122.395780),
    new google.maps.LatLng(37.772387, -122.423011),
    new google.maps.LatLng(37.772099, -122.423328),
    new google.maps.LatLng(37.771704, -122.423783),
    new google.maps.LatLng(37.771481, -122.424081),
    new google.maps.LatLng(37.771400, -122.424179),
    new google.maps.LatLng(37.771352, -122.424220),
    new google.maps.LatLng(37.771248, -122.424327),
    new google.maps.LatLng(37.770904, -122.424781),
    new google.maps.LatLng(37.770520, -122.425283),
    new google.maps.LatLng(37.770337, -122.425553),
    new google.maps.LatLng(37.770128, -122.425832),
    new google.maps.LatLng(37.769756, -122.426331),
    new google.maps.LatLng(37.769300, -122.426902),
    new google.maps.LatLng(37.769132, -122.427065),
    new google.maps.LatLng(37.769092, -122.427103),
    new google.maps.LatLng(37.768979, -122.427172),
    new google.maps.LatLng(37.768595, -122.427634),
    new google.maps.LatLng(37.768372, -122.427913),
    new google.maps.LatLng(37.768337, -122.427961),
    new google.maps.LatLng(37.768244, -122.428138),
    new google.maps.LatLng(37.767942, -122.428581),
    new google.maps.LatLng(37.767482, -122.429094),
    new google.maps.LatLng(37.767031, -122.429606),
    new google.maps.LatLng(37.766732, -122.429986),
    new google.maps.LatLng(37.766680, -122.430058),
    new google.maps.LatLng(37.766633, -122.430109),
    new google.maps.LatLng(37.766580, -122.430211),
    new google.maps.LatLng(37.766367, -122.430594),
    new google.maps.LatLng(37.765910, -122.431137),
    new google.maps.LatLng(37.765353, -122.431806),
    new google.maps.LatLng(37.764962, -122.432298),
    new google.maps.LatLng(37.764868, -122.432486),
    new google.maps.LatLng(37.764518, -122.432913),
    new google.maps.LatLng(37.763435, -122.434173),
    new google.maps.LatLng(37.790864, -122.402768),
    new google.maps.LatLng(37.790995, -122.402539),
    new google.maps.LatLng(37.791148, -122.402172),
    new google.maps.LatLng(37.791385, -122.401312),
    new google.maps.LatLng(37.791405, -122.400776),
    new google.maps.LatLng(37.791288, -122.400528),
    new google.maps.LatLng(37.791113, -122.400441),
    new google.maps.LatLng(37.791027, -122.400395),
    new google.maps.LatLng(37.791094, -122.400311),
    new google.maps.LatLng(37.791211, -122.400183),
    new google.maps.LatLng(37.791060, -122.399334),
    new google.maps.LatLng(37.790538, -122.398718),
    new google.maps.LatLng(37.790095, -122.398086),
    new google.maps.LatLng(37.789644, -122.397360),
    new google.maps.LatLng(37.789254, -122.396844),
    new google.maps.LatLng(37.788855, -122.396397),
    new google.maps.LatLng(37.788483, -122.395963),
    new google.maps.LatLng(37.788015, -122.395365),
    new google.maps.LatLng(37.787558, -122.394735),
    new google.maps.LatLng(37.787472, -122.394323),
    new google.maps.LatLng(37.787630, -122.394025),
    new google.maps.LatLng(37.787767, -122.393987),
    new google.maps.LatLng(37.787486, -122.394452),
    new google.maps.LatLng(37.786977, -122.395043),
    new google.maps.LatLng(37.786583, -122.395552),
    new google.maps.LatLng(37.786540, -122.395610),
    new google.maps.LatLng(37.786516, -122.395659),
    new google.maps.LatLng(37.786378, -122.395707),
    new google.maps.LatLng(37.786044, -122.395362),
    new google.maps.LatLng(37.785598, -122.394715),
    new google.maps.LatLng(37.785321, -122.394361),
    new google.maps.LatLng(37.785207, -122.394236),
    new google.maps.LatLng(37.785751, -122.394062),
    new google.maps.LatLng(37.785996, -122.393881),
    new google.maps.LatLng(37.786092, -122.393830),
    new google.maps.LatLng(37.785998, -122.393899),
    new google.maps.LatLng(37.785114, -122.394365),
    new google.maps.LatLng(37.785022, -122.394441),
    new google.maps.LatLng(37.784823, -122.394635),
    new google.maps.LatLng(37.784719, -122.394629),
    new google.maps.LatLng(37.785069, -122.394176),
    new google.maps.LatLng(37.785500, -122.393650),
    new google.maps.LatLng(37.785770, -122.393291),
    new google.maps.LatLng(37.785839, -122.393159),
    new google.maps.LatLng(37.782651, -122.400628),
    new google.maps.LatLng(37.782616, -122.400599),
    new google.maps.LatLng(37.782702, -122.400470),
    new google.maps.LatLng(37.782915, -122.400192),
    new google.maps.LatLng(37.783137, -122.399887),
    new google.maps.LatLng(37.783414, -122.399519),
    new google.maps.LatLng(37.783629, -122.399237),
    new google.maps.LatLng(37.783688, -122.399157),
    new google.maps.LatLng(37.783716, -122.399106),
    new google.maps.LatLng(37.783798, -122.399072),
    new google.maps.LatLng(37.783997, -122.399186),
    new google.maps.LatLng(37.799209, -122.420607),
    new google.maps.LatLng(37.795656, -122.400395),
    new google.maps.LatLng(37.795203, -122.400304),
    new google.maps.LatLng(37.778738, -122.415584),
    new google.maps.LatLng(37.778812, -122.415189),
    new google.maps.LatLng(37.778824, -122.415092),
    new google.maps.LatLng(37.778833, -122.414932),
    new google.maps.LatLng(37.778834, -122.414898),
    new google.maps.LatLng(37.778740, -122.414757),
    new google.maps.LatLng(37.778501, -122.414433),
    new google.maps.LatLng(37.778182, -122.414026),
    new google.maps.LatLng(37.777851, -122.413623),
    new google.maps.LatLng(37.777486, -122.413166),
    new google.maps.LatLng(37.777109, -122.412674),
    new google.maps.LatLng(37.776743, -122.412186),
    new google.maps.LatLng(37.776440, -122.411800),
    new google.maps.LatLng(37.776295, -122.411614),
    new google.maps.LatLng(37.776158, -122.411440),
    new google.maps.LatLng(37.775806, -122.410997),
    new google.maps.LatLng(37.775422, -122.410484),
    new google.maps.LatLng(37.775126, -122.410087),
    new google.maps.LatLng(37.775012, -122.409854),
    new google.maps.LatLng(37.775164, -122.409573),
    new google.maps.LatLng(37.775498, -122.409180),
    new google.maps.LatLng(37.775868, -122.408730),
    new google.maps.LatLng(37.776256, -122.408240),
    new google.maps.LatLng(37.776519, -122.407928),
    new google.maps.LatLng(37.776539, -122.407904),
    new google.maps.LatLng(37.776595, -122.407854),
    new google.maps.LatLng(37.776853, -122.407547),
    new google.maps.LatLng(37.777234, -122.407087),
    new google.maps.LatLng(37.777644, -122.406558),
    new google.maps.LatLng(37.778066, -122.406017),
    new google.maps.LatLng(37.778468, -122.405499),
    new google.maps.LatLng(37.778866, -122.404995),
    new google.maps.LatLng(37.779295, -122.404455),
    new google.maps.LatLng(37.779695, -122.403950),
    new google.maps.LatLng(37.779982, -122.403584),
    new google.maps.LatLng(37.780295, -122.403223),
    new google.maps.LatLng(37.780664, -122.402766),
    new google.maps.LatLng(37.781043, -122.402288),
    new google.maps.LatLng(37.781399, -122.401823),
    new google.maps.LatLng(37.781727, -122.401407),
    new google.maps.LatLng(37.781853, -122.401247),
    new google.maps.LatLng(37.781894, -122.401195),
    new google.maps.LatLng(37.782076, -122.400977),
    new google.maps.LatLng(37.782338, -122.400603),
    new google.maps.LatLng(37.782666, -122.400133),
    new google.maps.LatLng(37.783048, -122.399634),
    new google.maps.LatLng(37.783450, -122.399198),
    new google.maps.LatLng(37.783791, -122.398998),
    new google.maps.LatLng(37.784177, -122.398959),
    new google.maps.LatLng(37.784388, -122.398971),
    new google.maps.LatLng(37.784404, -122.399128),
    new google.maps.LatLng(37.784586, -122.399524),
    new google.maps.LatLng(37.784835, -122.399927),
    new google.maps.LatLng(37.785116, -122.400307),
    new google.maps.LatLng(37.785282, -122.400539),
    new google.maps.LatLng(37.785346, -122.400692),
    new google.maps.LatLng(37.765769, -122.407201),
    new google.maps.LatLng(37.765790, -122.407414),
    new google.maps.LatLng(37.765802, -122.407755),
    new google.maps.LatLng(37.765791, -122.408219),
    new google.maps.LatLng(37.765763, -122.408759),
    new google.maps.LatLng(37.765726, -122.409348),
    new google.maps.LatLng(37.765716, -122.409882),
    new google.maps.LatLng(37.765708, -122.410202),
    new google.maps.LatLng(37.765705, -122.410253),
    new google.maps.LatLng(37.765707, -122.410369),
    new google.maps.LatLng(37.765692, -122.410720),
    new google.maps.LatLng(37.765699, -122.411215),
    new google.maps.LatLng(37.765687, -122.411789),
    new google.maps.LatLng(37.765666, -122.412373),
    new google.maps.LatLng(37.765598, -122.412883),
    new google.maps.LatLng(37.765543, -122.413039),
    new google.maps.LatLng(37.764986, -122.422255),
    new google.maps.LatLng(37.764975, -122.422823),
    new google.maps.LatLng(37.764939, -122.423411),
    new google.maps.LatLng(37.764902, -122.424014),
    new google.maps.LatLng(37.764853, -122.424576),
    new google.maps.LatLng(37.764826, -122.424922),
    new google.maps.LatLng(37.764796, -122.425375),
    new google.maps.LatLng(37.764782, -122.425869),
    new google.maps.LatLng(37.764768, -122.426089),
    new google.maps.LatLng(37.764766, -122.426117),
    new google.maps.LatLng(37.764723, -122.426276),
    new google.maps.LatLng(37.764681, -122.426649),
    new google.maps.LatLng(37.782012, -122.404200),
    new google.maps.LatLng(37.781574, -122.404911),
    new google.maps.LatLng(37.781055, -122.405597),
    new google.maps.LatLng(37.780479, -122.406341),
    new google.maps.LatLng(37.779996, -122.406939),
    new google.maps.LatLng(37.779459, -122.407613),
    new google.maps.LatLng(37.778953, -122.408228),
    new google.maps.LatLng(37.778409, -122.408839),
    new google.maps.LatLng(37.777842, -122.409501),
    new google.maps.LatLng(37.777334, -122.410181),
    new google.maps.LatLng(37.776809, -122.410836),
    new google.maps.LatLng(37.776240, -122.411514),
    new google.maps.LatLng(37.775725, -122.412145),
    new google.maps.LatLng(37.775190, -122.412805),
    new google.maps.LatLng(37.774672, -122.413464),
    new google.maps.LatLng(37.774084, -122.414186),
    new google.maps.LatLng(37.773533, -122.413636),
    new google.maps.LatLng(37.773021, -122.413009),
    new google.maps.LatLng(37.772501, -122.412371),
    new google.maps.LatLng(37.771964, -122.411681),
    new google.maps.LatLng(37.771479, -122.411078),
    new google.maps.LatLng(37.770992, -122.410477),
    new google.maps.LatLng(37.770467, -122.409801),
    new google.maps.LatLng(37.770090, -122.408904),
    new google.maps.LatLng(37.769657, -122.408103),
    new google.maps.LatLng(37.769132, -122.407276),
    new google.maps.LatLng(37.768564, -122.406469),
    new google.maps.LatLng(37.767980, -122.405745),
    new google.maps.LatLng(37.767380, -122.405299),
    new google.maps.LatLng(37.766604, -122.405297),
    new google.maps.LatLng(37.759732, -122.406484),
    new google.maps.LatLng(37.758910, -122.406228),
    new google.maps.LatLng(37.758182, -122.405695),
    new google.maps.LatLng(37.757676, -122.405118),
    new google.maps.LatLng(37.757039, -122.404346),
    new google.maps.LatLng(37.756335, -122.403719),
    new google.maps.LatLng(37.755503, -122.403406),
    new google.maps.LatLng(37.754665, -122.403242),
    new google.maps.LatLng(37.753837, -122.403172),
    new google.maps.LatLng(37.752986, -122.403112),
    new google.maps.LatLng(37.751266, -122.403355)
  ];

  // var heatmap = new google.maps.visualization.HeatmapLayer({
  //   data: heatmapData,
  //   dissipating:true
  // });
  // heatmap.setMap(this.map);
  // heatmap.set('radius', 10)

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
    if (places.length == 0) return;

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
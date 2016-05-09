var config         = require("./config/config");
var express        = require('express');
var app            = express();
var morgan         = require("morgan");
var methodOverride = require("method-override");
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var passport       = require("passport");
var expressJWT     = require("express-jwt");
var routes         = require("./config/routes"); 
var cors           = require("cors");

require("./config/passport")(passport);

mongoose.connect(config.database);

app.use(express.static(__dirname + '/public'));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === "object" && "_method" in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/api', expressJWT({ secret: config.secret })
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/register', methods: ['POST'] }
    ]
  }));
  
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'Unauthorized request.'});
  }
  next();
});

app.use("/api", routes);

app.get('*', function(req, res){
  res.sendFile(__dirname + "/public/index.html");
})

app.listen(config.port, function(){
  console.log("Express is alive and kicking on port: ", config.port);
})
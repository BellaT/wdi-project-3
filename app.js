var config         = require("./config/config");
var express        = require('express');
var app            = express();
var morgan         = require("morgan");
var methodOverride = require("method-override");
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");

mongoose.connect(config.database);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === "object" && "_method" in req.body){
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));



app.lsiten(config.port, function(){
  console.log("Express is alive and kicking on port: ", config.port);
})
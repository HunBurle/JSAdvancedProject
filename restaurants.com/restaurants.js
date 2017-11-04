/////////////////////////////////////////////////////////////
//
// Dependencies
//

var express = require('express');
var fs = require("fs");

/////////////////////////////////////////////////////////////
//
// Server Setup
//

// set up server (app) host and port
var app = express();
var server = app.listen(80, "127.0.0.1");

// serve static files from the public directory
app.use(express.static(__dirname + "/public"));


/////////////////////////////////////////////////////////////
//
// Initialization
//

var cuisines = [];
var sushi = [];
var tapas = [];
var pho = [];
var allRest = [];
// ** CREATE VARIABLES TO HOLD CUISINE AND RESTAURANT ARRAYS HERE **

// this is an Immediately-Invoked Function Expression (IIFE)
// it is used to initialize the server by loading restaurant
// data into memory
(function serverInit(){
    cuisines = getRestaurantData("cuisines");
    cuisines.forEach(function(element) {
       switch (element){
        case 'sushi':
        sushi = getRestaurantData("sushi");
      case 'tapas':
      tapas = getRestaurantData("tapas");
      case 'pho':
     pho =  getRestaurantData("pho");
       }   
       allRest = [sushi,tapas,pho];
    });
    
})();
// ** INSERT IMMEDIATELY-INVOCED FUNCTION EXPRESSION HERE **

// load data from files and convert to JSON
function getRestaurantData(filename) {
    var data = fs.readFileSync(__dirname + "/data/" + filename + ".json", 'utf8');
    return JSON.parse(data);
}



/////////////////////////////////////////////////////////////
//
// RESTful services
//

// get all cuisines
app.get('/cuisines', function(req, res){

    res.end(JSON.stringify(cuisines));

});

// get all restaurants
app.get('/restaurants', function (req, res){

    res.end(JSON.stringify(allRest));
    // ** RETURN ALL RESTAURANTS MATCING THE CUISINE TYPE HERE **

});

// get restaurants by cuisine
app.get('/restaurants/:cuisine', function (req, res){

    var cuisine = req.params.cuisine;
    switch (cuisine){
        case "sushi": res.end(JSON.stringify(sushi));
        case "tapas": res.end(JSON.stringify(tapas));
        case "pho"  : res.end(JSON.stringify(pho));
        default : throw new Error("The requested information isnt here!");
    }
    
    // ** RETURN RESTAURANTS MATCING THE CUISINE TYPE HERE **

});
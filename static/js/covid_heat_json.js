// functions to create covid map layers
// by Chris Chiang
// This version take end point jsons as data

// Heatmap generating function
// take in a map, control object, date string, initialization boolean, timeslider object
function heatMap(map,control,date,init,slider){
  // Set up division of data points to increase performance
  divide_points = 30
  heat_path = "/weekly/"
  var heat;
  var heatArray = [];
  d3.json(heat_path+"'"+date+"'", function(data) {
    data.forEach((row)=>{
      // For each case/divide_points push a data point into the heat layer
      for (var i =0;i<Math.round(row.Confirmed/divide_points);i++){
        if (row.Latitude!=null & row.Longitude!=null){
          heatArray.push([row.Latitude, row.Longitude]);}
      };
    });
    heat = L.heatLayer(heatArray, {
      radius: 35,
      blur: 15,
      minOpacity: 0.15
    }).addTo(myMap);
    control.addOverlay(heat,'Covid19 Heat')

    // slider set up and functions
    var start_date = "03-04-2020"
    var last_date = "04-29-2020"

    // Setup labels and dates
    var timeLabels =[];
    var dateRange = [];
    var curDate = d3.isoParse(start_date);
    var loadStringFormatter =d3.timeFormat('%m-%d-%Y')
    var formatterShort = d3.timeFormat('%m-%d')
    for (var i=0;i<9;i++){
      timeLabels.push(formatterShort(curDate));
      dateRange.push(curDate);
      var nextDate = d3.timeDay.offset(curDate, 7);
      curDate = nextDate;
    }
    timeLabels=timeLabels.reverse();
    dateRange=dateRange.reverse();

    // function that trigger everytime the slider slides
    // set up recursively to keep the reference of last heatmap layers
    function mapChange({label,value,map,lastHeat,cPanel,slide}){
      lastHeat.forEach((hLayer=>{
        map.removeLayer(hLayer);
        cPanel.removeLayer(hLayer);
      }))
      setTimeout(
      heatMap(map,cPanel,loadStringFormatter(dateRange[value-1]),false,slide),500);
    };
    // if the heatmap is created for the first time set up slider initialization
    if (init){
    var timeSlide = L.control.timelineSlider({
          timelineItems: timeLabels,
          position: 'bottomleft',
          initializeChange: false,
          extraChangeMapParams: {lastHeat: [heat],cPanel:control,slide:null}, 
          changeMap: mapChange });
        timeSlide.addTo(myMap);
        timeSlide.options.extraChangeMapParams.slide=timeSlide;
      }else{
        slider.options.extraChangeMapParams.lastHeat.push(heat);

      }
  });

};


// function that plot cases data points as circles base on longitude and latitude
// circle radius is dependent on number of confirmed cases in each location 
function circleMap(map,control,date){
  data_path = "/weekly/"
  var circleArray =[];
  d3.json(data_path+"'"+date+"'", function(data) {
    data.forEach((row)=>{
      if (row.Latitude!=null & row.Longitude!=null){
        circleArray.push(
          L.circle([row.Latitude, row.Longitude], {
            stroke: false,
            fillOpacity: 0.50,
            color: "OldLace",
            fillColor: "MediumSeaGreen",
            radius: row.Confirmed*3 
          })
        );}
    })
  circleLayer = L.layerGroup(circleArray)
  // circleLayer.addTo(map); set default to not add layer
  control.addOverlay(circleLayer,'Covid Circle');
  });
};

// Testing Code below


// Define variables for our base layers
// var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// });

// // Create two separate layer groups: one for cities and one for states
// var states = L.layerGroup(stateMarkers);
// var cities = L.layerGroup(cityMarkers);

// Create a baseMaps object
// var baseMaps = {
//   "Street Map": streetmap,
// };

// // Create an overlay object
// var overlayMaps = {};

// // Define a map object
// var myMap = L.map("map", {
//   center: [37.09, -95.71],
//   zoom: 5,
// });

// Pass our map layers into our layer control
// Add the layer control to the map


// circleMap(myMap,test_date).addTo(myMap);

// streetmap.addTo(myMap);
// test_date = "04-29-2020"
// var controlPanel = L.control.layers(baseMaps, overlayMaps, {
//   collapsed: false
// });
// controlPanel.addTo(myMap);
// heatMap(myMap,controlPanel,test_date);
// circleMap(myMap,controlPanel,test_date);
// a = d3.isoParse('2020-01-03');
// console.log(a);
// console.log(type(a));
// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: false
// }).addTo(myMap);




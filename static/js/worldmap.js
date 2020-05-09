var myMap = L.map("map", {
  center: [0.00, 0.00],
  zoom: 2
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

var geoData = "static/data/ne_110m_admin_0_countries.json";

d3.csv("cleaned_data/In_progress/covid_daily_world.csv", function(results) { 

      function chooseColor(d) {
        switch (true) {
        case (d < 1000):
          return "rgb(191, 255, 0)";
          break;
        case (d < 10000):
          return "rgb(255, 255, 0)";
          break;
        case (d < 100000):
          return "rgb(255, 191, 0)";
          break;
        case (d < 1000000):
          return "rgb(255, 128, 0)";
          break;
        case (d < 10000000):
          return "rgb(255, 64, 0)";
          break;
        default:
          return "rgb(169,169,169)";
        }
      };
      var country = {},
          data = results.map(row => row['Country/Region']);

      for (var i = 0; i < data.length; i += 1) {
        country[data[i]] = results[i].Confirmed;
    }
        
      d3.json(geoData, function(mapData) {
              L.geoJson(mapData, {
                style: function(feature){
                  return {
                      weight: 1,
                      opacity: 1,
                      color: 'white',
                      fillOpacity: 0.5,
                      fillColor: chooseColor(parseFloat(country[feature.properties.NAME]))
              }},
                    
        onEachFeature: function(feature, layer) {
          layer.on({
              mouseover: function(event) {
                  layer = event.target;
                  layer.setStyle({
                  fillOpacity: 0.2,
                  weight: 1
              });
            },
              mouseout: function(event) {
                  layer = event.target;
                  layer.setStyle({
                  fillOpacity: 0.5,
                  weight: 1
              });
            },
          });
          layer.bindPopup("<h4> Name: " + feature.properties.NAME + "</h4> <hr> <h4> COVID19 Cases: " + country[feature.properties.NAME] + "</h4>");
          }
        }).addTo(myMap);

        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function(myMap) {
          var div = L.DomUtil.create("div", "info legend"),
              grades = [0,1000, 10000, 100000, 1000000];
    
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i]) + '"></i> '  + "<" + 
            (grades[i + 1] ? + grades[i + 1]  + '<br>' : '+' + grades[i]);
        } 
        return div;
        };
        legend.addTo(myMap);
      })
    })

    

    // d3.csv("cleaned_data/In_progress/countries_coordinates.csv", function(error1, data1) {
      //   d3.csv("cleaned_data/In_progress/covid_daily_world.csv", function(error2, data2) {
      //           console.log(data1);
       
      //       var countryLat = data1.map(data => data.latitude);
      //       var countryLon = data1.map(data => data.longitude);
      //       var confirmedCovid = data2.map(data => data.Confirmed);
      
      //       // function markerSize(population) {
      //       //   return population / 40;
      //       // }
      //       var covidMarkers = [];
      
      //       for (var i = 0; i < data1.length; i++) {
      //         var coordinates = "["+countryLat[i]+","+countryLon[i]+"]";
      
      //         covidMarkers.push(
      //           L.circle(data1[i].coordinates, {
      //             stroke: false,
      //             fillOpacity: 0.75,
      //             color: "white",
      //             fillColor: "white",
      //             radius: confirmedCovid[i]
      //           })
      //         );
      //       }
      
      //   });
      // });
      
      // var covidCases = L.layerGroup(covidMarkers);
      // var overlayMaps = {
      //   "Covid Cases": covidCases,
      // };
      
      // L.control.layers(overlayMaps, {
      //   collapsed: false
      // }).addTo(myMap);


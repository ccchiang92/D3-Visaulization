// Chropoleth Map: COVID19
var geoData = "static/data/ne_110m_admin_0_countries.json";

d3.csv("static/data/covid_daily_world.csv", function(results) { 

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
      var countryCases = {},
          countryData = results.map(row => row['Country/Region']);

      for (var i = 0; i < countryData.length; i += 1) {
        countryCases[countryData[i]] = results[i].Confirmed;
    }

      var countryDeath = {};

      for (var i = 0; i < countryData.length; i += 1) {
        countryDeath[countryData[i]] = results[i].Deaths;
      }

      d3.json(geoData, function(mapData) {
              L.geoJson(mapData, {
                style: function(feature){
                  return {
                      weight: 1,
                      opacity: 1,
                      color: 'white',
                      fillOpacity: 0.5,
                      fillColor: chooseColor(parseFloat(countryCases[feature.properties.NAME]))
              }},
                    
        onEachFeature: function(feature, layer) {
          layer.on({
              mouseover: function(event) {
                  layer = event.target;
                  layer.setStyle({
                  fillOpacity: 0,
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
          layer.bindPopup("<h4>" + feature.properties.NAME + "</h4> <hr> <h4> COVID-19 Cases: " + 
          countryCases[feature.properties.NAME] + "</h4> <hr> <h4> COVID-19 Deaths: " + countryDeath[feature.properties.NAME] + "</h4>");
          }
        }).addTo(myMap);

        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function(myMap) {
          var div = L.DomUtil.create("div", "info legend"),
              grades = [0,1000, 10000, 100000, 1000000];
              div.innerHTML = '<p> Covid-19 Cases</p>'
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

//***************************


    function chooseRadius(d) {
      switch (true) {
      case (d < 10):
        return 80;
        break;
      case (d < 50):
        return 100;
        break;
      case (d < 120):
        return 100;
        break;
      case (d < 500):
        return 160;
        break;
      case (d < 1000):
        return 200;
        break;
      case (d < 10000):
        return 300;
        break;
      default:
        return 300;
      }
    };

  // Read csv *******************    
    d3.csv("static/data/countries_coordinates.csv", function(error1, data1) {
        d3.csv("static/data/ebola_final.csv", function(error2, data2) {
          d3.csv("static/data/SARS_data.csv", function(error2, data3) {

          var coordinates={},
              countryID = data1.map(row => row.country),
              latitude = data1.map(row => row.latitude),
              longitude = data1.map(row => row.longitude);

          for (var i = 0; i < countryID.length; i += 1) {
            coordinates[countryID[i]] = [latitude[i],longitude[i]];
          }


  
  // Ebola Layer ****************
            var ebolaMarkers = [],
                countryNames={},
                countryName = data2.map(row => row.Country),
                codeEbolaID = data2.map(row => row.code),
                countryEbola = {},
                countryEbolaId = data2.map(row => row.code);
  
            for (var i = 0; i < countryEbolaId.length; i += 1) {
              countryEbola[countryEbolaId[i]] = data2[i]["No. of confirmed cases"];
          }

            for (var i = 0; i < countryName.length; i += 1) {
              countryNames[codeEbolaID[i]] = countryName[i];
          }

          var countryEbolaCode = [...new Set(data2.map(data => data.code))];   

            for (var i = 0; i < countryEbolaCode.length; i++) {             
              ebolaMarkers.push(
                L.circle(coordinates[countryEbolaCode[i]], {
                  stroke: false,
                  fillOpacity: 0.5,
                  color: "black",
                  fillColor: "blue",
                  radius: chooseRadius(countryEbola[countryEbolaCode[i]])*2000
                }).bindPopup("<h4>" + countryNames[countryEbolaCode[i]] + "</h4> <hr> <h4>Ebola Cases: " + countryEbola[countryEbolaCode[i]] + "</h4>")
              );
            }
            var ebolaLayer = L.layerGroup(ebolaMarkers);

            
    // SARS Layer ****************
            var no_total =[];
            data3.forEach(function(row) {
              if (row.Country!='Total'){
                  no_total.push(row);
              }
            });
            var sarsMarkers = [],
                countryName = data1.map(row => row.name),
                countrySars = {},
                countrySarsId = no_total.map(row => row.Country);

            for (var i = 0; i < countryName.length; i += 1) {
              coordinates[countryName[i]] = [latitude[i],longitude[i]];
            }

            for (var i = 0; i < countrySarsId.length; i += 1) {
              countrySars[countrySarsId[i]] = no_total[i].Cases;}
          
          var countrySarsCode = [...new Set(no_total.map(data => data.Country))];
          
            for (var i = 0; i < countrySarsCode.length; i++) {             
              sarsMarkers.push(
                L.circle(coordinates[countrySarsCode[i]], {
                  stroke: false,
                  fillOpacity: 0.5,
                  color: "black",
                  fillColor: "red",
                  radius: chooseRadius(countrySars[countrySarsCode[i]])*2000
                }).bindPopup("<h4>" + countrySarsCode[i] + "</h4> <hr> <h4>SARS Cases: " + countrySars[countrySarsCode[i]] + "</h4>")
              );
            }
            var sarsLayer = L.layerGroup(sarsMarkers);

    // Maps and Combine Layers ******************
            var overlayMaps = {
                "Ebola": ebolaLayer,
                "SARS": sarsLayer
              };
            
              var controlPanel = L.control.layers(baseMaps, overlayMaps, {
                  collapsed: false
              });
              controlPanel.addTo(myMap);
              circleMap(myMap,controlPanel,'04-29-2020');
              heatMap(myMap,controlPanel,'04-29-2020',true,null);


              

            
        });
      });
    });
  
  // Leaflet******************************

    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    })
    var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    })
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    })
    
    var myMap = L.map("map", {
      center: [30.00, 0.00],
      zoom: 2,
      layers: [streets]
    });

    var baseMaps = {
      "Light": light,
      "Streets": streets,
      "Satellite": satellite,
    };


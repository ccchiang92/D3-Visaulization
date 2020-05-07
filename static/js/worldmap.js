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

d3.json(geoData, function(data) {
      L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng,{
          color: "black",
          weight: 1
      });
    },
      onEachFeature: function(feature, layer) {
        layer.on({
            mouseover: function(event) {
                layer = event.target;
                layer.setStyle({
                fillOpacity: 0.5,
                weight: 2
            });
          },
            mouseout: function(event) {
                layer = event.target;
                layer.setStyle({
                fillOpacity: 0.2,
                weight: 1
            });
          },
        });
        layer.bindPopup("<h4> Name: " + feature.properties.NAME + "</h4> <hr> <h4> Population: " + feature.properties.POP_EST + "</h4>");
        }

  // var geojson = L.choropleth(data, {

  //   valueProperty: "MHI2016",
  //   scale: ["#ffffb2", "#b10026"],
  //   steps: 10,

  //   // q for quartile, e for equidistant, k for k-means
  //   mode: "q",
  //   style: {
  //     color: "#fff",
  //     weight: 1,
  //     fillOpacity: 0.8
  //   },

    // onEachFeature: function(feature, layer) {
    //   layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
    //     "$" + feature.properties.MHI2016);
    // }



  }).addTo(myMap);
});

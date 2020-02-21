geoURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


d3.json(geoURL,function(geoURL_data){
    var features_data = L.geoJSON(geoURL_data.features)
    create_map(geoURL_data.features)
})


function create_map(geoURL_data_features) {
 var myMap = L.map("map",{
  center: [39.09, -114.71],
  zoom:5,
  });


  var light_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
         maxZoom: 18,
         id: "mapbox.light",
         accessToken:API_KEY,
  }).addTo(myMap);

function fill_color(mag)
{
  if (mag > 5) {
   return "red";
  }
  else if (mag <= 5 && mag >4) {
   return "orangered";
  }
  else if (mag <= 4 && mag >3) {
    return "orange";
  }

  else if (mag <= 3 && mag >2) {
    return "#ff9933";
  }

  else if (mag <= 2 && mag >1) {
    return "#ffff00";
  }
  else if (mag <= 1 && mag >0) {
    return "#adff2f"
  };
};

var coords = [];
   
geoURL_data_features.forEach(d=> {
    coords.push(d.geometry.coordinates[1],d.geometry.coordinates[0])

    var circles =
      L.circle(coords,{                 
        fillOpacity:0.8,        
        color:"brown",
        weight:0.45,
        fillColor:fill_color(d.properties.mag),
        radius:d.properties.mag * 20000
      }).bindPopup(`<h3> ${d.properties.place} </h3> <hr> <p> <b>${Date(d.properties.time)} <br> EarthQuake Magnitude:${d.properties.mag}<b></p>`)
        .addTo(myMap)

     
     coords = [] 
    
   })

  // adding legend to the bottom right 

  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function(map){
    var div = L.DomUtil.create('div', 'info legend'),
    mag = [0,1,2,3,4,5],
    labels = [];
    for (var i=0; i<mag.length; i++) {
      div.innerHTML += '<i style="background:' + fill_color(mag[i]) + '"></i> ' + mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>':'+');
     }
    return div;
  };

      legend.addTo(myMap)     
};
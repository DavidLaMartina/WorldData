mapboxgl.accessToken = 'pk.eyJ1IjoiZGxhbWFydGluYSIsImEiOiJjanRsa3V6ZjAwOTljM3lvamwzeTE2bmp2In0.o8FGySTUwN0IG1NOcL3HKg';
var map = new mapboxgl.Map({
  container: 'map',
  zoom: 9,
  center: [137.9150899566626, 36.25956997955441],
  style: 'mapbox://styles/mapbox/satellite-v9'
});

const modes = MapboxDraw.modes;
modes.draw_polygon = DrawRectangle;

var draw = new MapboxDraw({
  displayControlsDefault: false,
  modes: modes,
  controls: {
    polygon: true,
    trash: true
  }
});
map.addControl(draw);
// draw.changeMode('draw_rectangle');

// map.on('draw.create', function(e){
//   console.log(e.features);
// })

map.on('draw.create', function(e){
  getData(e.features[0]);
})
// map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

function updateArea(e) {
  var data = draw.getAll();
  var answer = document.getElementById('calculated-area');
  if (data.features.length > 0) {
    var area = turf.area(data);
    // restrict to area to 2 decimal points
    var rounded_area = Math.round(area*100)/100;
    answer.innerHTML = '<p><strong>' + rounded_area + '</strong></p><p>square meters</p>';
  } else {
    answer.innerHTML = '';
    if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
  }
}

function getData(geoJSON){
  var coords = geoJSON.geometry.coordinates.flat();
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/GeoEnrichment/enrich",
    "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    },
    "data": {
  		"f": "json",
      "token": "bc_hr2H5pyQ2GQ0Vnnd2xia0EbDcLYGr1Z2EQ1QtYo9XNdHYhzEpp2kpO0yXDSvj6NnMpxuxQXLSY2WzJNAyVlYcPXFzi5ww_9rgba_aZSuA8taJi3ewcXJJuNG9dPM_pdskUpkJ43Rg1fZkwDF9Cw..",
      "inSR": "4326",
      "outSR": "4326",
      "returnGeometry": "true",
      "studyAreas": `[{\"geometry\":{\"rings\":[${JSON.stringify(coords)}],\"spatialReference\":{\"wkid\":4326}},\"attributes\":{\"id\":\"1\",\"name\":\"optional polygon area name\"}}]`,
      "studyAreasOptions": "{\n  \"areaType\":\"RingBuffer\",\n  \"bufferUnits\":\"esriMiles\",\n  \"bufferRadii\":[1]\n}",
      "dataCollections": "[\"KeyGlobalFacts\"]"
    }
  }
  $.ajax(settings)
    .done(function (response) {
      console.log(JSON.parse(response));
  });
}

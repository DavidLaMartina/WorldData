var plotData = {};
plotData.data = [];

$(document).ready(function(){
  addRecentEvents();
  addDataSelections();
})

mapboxgl.accessToken = 'pk.eyJ1IjoiZGxhbWFydGluYSIsImEiOiJjanRsa3V6ZjAwOTljM3lvamwzeTE2bmp2In0.o8FGySTUwN0IG1NOcL3HKg';
var map = new mapboxgl.Map({
  container: 'map',
  zoom: 4,
  center: [-98.5795, 39.8283],
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
      "dataCollections": "[\"KeyGlobalFacts\", \"KeyFacts\", KeyUSFacts]"
      // "analysisVariables": "[\"KeyGlobalFacts.AVGHHSIZE\", \"AtRisk.AVGHINC_CY\", \"DaytimePopulation_DROP_CY\", \"AtRisk.MP27002A_B\"]"
    }
  }
  $.ajax(settings)
    .done(function (response) {
      return response;
  })
  .then(function(data){
    var siteData = JSON.parse(data).results[0].value.FeatureSet[0].features;
    var keySets = getSelections();
    var dataTotals = {};
    var currentData = 0;

    for (let keySet in keySets){
      dataTotals[keySet] = 0;
      for (let site of siteData){
        for (let key of keySets[keySet]){
          if (site.attributes[key]){
            currentData = site.attributes[key];
            break;
          }
          currentData = 0;
        }
        dataTotals[keySet] += currentData;
      }
    }
    updateRecent(dataTotals);
    plotData.data.push(dataTotals);
    console.log(plotData);
  })
}
function plotData(){
  
}
function addDataSelections(){
  for (let menu of $('#selection-container').find('select')){
    for (let data in dataVars){
      $(menu).append($('<option>', {
        value: data,
        text: dataVars[data].name
      }));
    }
  }
}
function addRecentEvents(){
  var selects = $('#selection-container').find('select');
  var displays = $('#recent-container').find('.recent-text');
  for (let i = 0; i < selects.length; i++){
    $(selects[i]).change(function(){
      var optionSelected = $(this).find('option:selected');
      $(displays[i]).text(optionSelected.text());
    })
  }
}
function getSelections(){
  var keySets = {}
  keySets['x'] = dataVars[$('#x-select').find('option:selected').val()].keys;
  keySets['y'] = dataVars[$('#y-select').find('option:selected').val()].keys;
  keySets['rad'] = dataVars[$('#rad-select').find('option:selected').val()].keys;
  keySets['color'] = dataVars[$('#color-select').find('option:selected').val()].keys;
  return keySets
}
function updateRecent(recentData){
  $('#x-data').text(recentData['x']);
  $('#y-data').text(recentData['y']);
  $('#rad-data').text(recentData['rad']);
  $('#color-data').text(recentData['color']);
}

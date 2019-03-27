var plotData = {};
plotData.data = [];
var rememberRecents = null;

$(document).ready(function(){
  addRecentEvents();
  addDataSelections();
  updateRecentText();
  setLockButton();
  setPlotButton();
  setResetButton();
  enableLockButton();
  disablePlotButton();
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

map.on('draw.create', function(e){
  getData(e.features[0]);
  updateArea(e);
})
map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

function updateArea(e) {
  var data = draw.getAll();
  var answer = document.getElementById('calculated-area');
  if (data.features.length > 0) {
    var area = turf.area(data);
    var rounded_area = Math.floor(Math.round(area*100)/100 / 1000000);
    answer.innerHTML = '<p class="calculation"><strong>' + rounded_area + '</strong></p><p class="calculation">square kilometers</p>';
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
      "dataCollections": "[\"KeyGlobalFacts\", \"KeyFacts\", KeyUSFacts, educationalattainment]"
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
      updateRecentText();
    })
  }
}
function updateRecentText(){
  var selects = $('#selection-container').find('select');
  var displays = $('#recent-container').find('.recent-text');
  for (let i = 0; i < selects.length; i++){
    var optionSelected = $(selects[i]).find('option:selected');
    $(displays[i]).text(optionSelected.text() + ': ');
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
  if (recentData){
    $('#x-data').text(recentData['x']);
    $('#y-data').text(recentData['y']);
    $('#rad-data').text(recentData['rad']);
    $('#color-data').text(recentData['color']);
  }else{
    $('#x-data').text('');
    $('#y-data').text('');
    $('#rad-data').text('');
    $('#color-data').text('');
  }
}
function setLockButton(){
  $('#lock-button').on('click', function(){
    $('.custom-select').attr('disabled', true);
    plotData.xText = $('#x-select').find('option:selected').text();
    plotData.yText = $('#y-select').find('option:selected').text();
    plotData.radText = $('#rad-select').find('option:selected').text();
    plotData.colorText = $('#color-select').find('option:selected').text();
    disableLockButton();
    enablePlotButton();
    map.addControl(draw);
  })
}
function setPlotButton(){
  $('#plot-button').on('click', function(){
    rememberRecents = plot(plotData);
    disablePlotButton();
  });
}
function setResetButton(){
  $('#reset-button').on('click', function(){
    if($('#plot').length){
      $('#plot').replaceWith(rememberRecents);
      rememberRecents = null;
    }
    enableLockButton();
    $('.custom-select').attr('disabled', false);
    draw.deleteAll();
    map.removeControl(draw);
    updateRecent();
    plotData = {};
    plotData.data = [];
  })
}
function enableLockButton(){$('#lock-button').attr('disabled', false)}
function disableLockButton(){$('#lock-button').attr('disabled', true)}
function enablePlotButton(){$('#plot-button').attr('disabled', false)}
function disablePlotButton(){$('#plot-button').attr('disabled', true)}

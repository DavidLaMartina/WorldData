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

map.on('draw.create', updateArea);
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

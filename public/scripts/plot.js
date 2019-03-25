var testData = {};
testData.xText = "Here is the x-axis";
testData.yText = "Here is the y-axis";
testData.topText = "Here is the top text";
testData.data = [
  {
    'x': 5,
    'y': 11,
    'rad': 15,
    'color': 12
  },
  {
    'x': 10,
    'y': 3,
    'rad': 90,
    'color': 115
  },
  {
    'x': 15,
    'y': 7,
    'rad': 10,
    'color': 56
  },
  {
    'x': 20,
    'y': 9,
    'rad': 50,
    'color': 78
  },
  {
    'x': 25,
    'y': 5,
    'rad': 75,
    'color': 2
  }
];
plotData(testData);


function plotData(input){
  var width = $('#plot-container').get(0).clientWidth * 0.95,
      height = $('body').get(0).clientHeight * 0.95;
      height = 500;
      padding = 10;

  var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

  var data = input.data.filter(mustHaveXY);

  var xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([padding, width - padding]);
  var yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y))
    .range([height - padding, padding]);
  var radiusScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.rad))
    .range([3, 20])
  var colorScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.color))
    .range(['green', 'blue']);

  var xAxis = d3.axisBottom(xScale)
    .tickSize(-height + 2 * padding)
    .tickSizeOuter(0);
  var yAxis = d3.axisLeft(yScale)
    .tickSize(-height + 2 * padding)
    .tickSizeOuter(0);

  svg.append('g')
    .attr('transform', 'translate(0,' + (height - padding) + ')')
    .call(xAxis);
  svg.append('g')
    .attr('transform', 'translate(' + padding + ',0)')
    .call(yAxis);

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', (height - padding))
    .attr('dy', padding / 2)
    .style('text-anchor', 'middle')
    .text(input.xText);
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', - height / 2)
    .attr('dy', padding / 2)
    .style('text-anchor', 'middle')
    .text(input.yText);
  svg.append("text")
    .attr("x", width / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(input.topText);

  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d => radiusScale(d.rad))
      .attr('fill', d => colorScale(d.color))
      .attr('stroke', '#fff');
}

function mustHaveXY(data){
  var keys = ['x', 'y'];
  for (let key of keys){if(!data[key]) return false;}
  return true;
}

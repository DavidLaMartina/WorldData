function plot(input){
  var width = $('#recent-container').get(0).clientWidth * 0.95,
      height = 500; // $('body').get(0).clientHeight * 0.55,
      padding = 50;

  var remember = $('#recent').replaceWith('<svg></svg>');

  var svg = d3.select('svg')
    .attr('id', 'plot')
    .attr('baseProfile', 'full')
    .attr('version', '1.1')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
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
    .tickSize(-width + 2 * padding)
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
    .attr('transform', 'translate(0,' + 10 + ')')
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
    .text("Radius: " + input.radText + ", " + "Color: " + input.colorText);

  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d => radiusScale(d.rad))
      .attr('fill', d => colorScale(d.color))
      .attr('stroke', '#fff');

  return remember;
}

function mustHaveXY(data){
  var keys = ['x', 'y'];
  for (let key of keys){if(!data[key]) return false;}
  return true;
}

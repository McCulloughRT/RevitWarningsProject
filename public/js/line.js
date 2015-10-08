function line(lineData, indx) {
  var dataset = lineData;

  var margin = {top: 10, right: 20, bottom: 30, left: 50},
      width = 400 - margin.left - margin.right,
      height = 220 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeBands([0, width])
      .domain(dataset.map(function(d) { return d.phase; }));

  var y = d3.scale.linear()
      .range([height,0])
      .domain(d3.extent(dataset, function(d) {return d.average; }));

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var theLine = d3.svg.line()
      .x(function(d) { return x(d.phase); })
      .y(function(d) { return y(d.average); })
      .interpolate('basis');

  var svg = d3.select("#lineChart" + indx).append("svg")
      // .attr("width", width + margin.left + margin.right)
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(-40," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Warnings");

  svg.append("path")
      .data([dataset])
      .attr("class", "line")
      .attr("d", theLine);
}

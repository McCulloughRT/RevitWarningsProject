
function boxplot(boxData, indx) {
  var labels = true; // show the text labels beside individual boxplots?

  var margin = {top: 10, right: 50, bottom: 70, left: 50};
  var  width = 225 - margin.left - margin.right;
  var height = 260 - margin.top - margin.bottom;

  var min = Infinity,
      max = -Infinity;

  var input = boxData;
  var data = [];
  data[0] = [];
  data[0][0] = "IQR";

  data[0][1] = input;
  max = Math.max.apply(null, data[0][1]);
  min = Math.min.apply(null, data[0][1]);

  var chart = d3.box()
  	.whiskers(iqr(1.5))
  	.height(height)
  	.domain([min, max])
  	.showLabels(labels);

  var svg = d3.select("#boxplot" + indx).append("svg")
  	.attr("width", width + margin.left + margin.right)
  	.attr("height", height + margin.top + margin.bottom)
  	.attr("class", "box")
  	.append("g")
  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // the x-axis
  var x = d3.scale.ordinal()
  	.domain( data.map(function(d) { console.log(d); return d[0] } ) )
  	.rangeRoundBands([0 , width], 0.7, 0.3);

  var xAxis = d3.svg.axis()
  	.scale(x)
  	.orient("bottom");

  // the y-axis
  var y = d3.scale.linear()
  	.domain([min, max])
  	.range([height + margin.top, 0 + margin.top]);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  // draw the boxplots
  svg.selectAll(".box")
      .data(data)
    .enter().append("g")
  	.attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
      .call(chart.width(x.rangeBand()));


  // add a title
  // svg.append("text")
  //       .attr("x", (width / 2))
  //       .attr("y", 0 + (margin.top / 2))
  //       .attr("text-anchor", "middle")
  //       .style("font-size", "18px")
  //       //.style("text-decoration", "underline")
  //       .text("Revenue 2012");

   // draw y axis
  svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
  	.append("text") // and text1
  	  .attr("transform", "rotate(-90)")
  	  .attr("y", 6)
  	  .attr("dy", ".71em")
  	  .style("text-anchor", "end")
  	  .style("font-size", "8px");
  	  // .text("Revenue in €");

  // draw x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
      .call(xAxis)
    .append("text")             // text label for the x axis
        .attr("x", (width / 2) )
        .attr("y",  10 )
  	.attr("dy", ".71em")
        .style("text-anchor", "middle")
  	.style("font-size", "8px");
        //.text("Quarter");
}

// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}

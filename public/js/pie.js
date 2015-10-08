function pie(pieData, indx) {

var dataset = [
  { label: 'Filled', count: pieData },
  { label: 'Open', count: (100 - pieData) }
];

var width = 190;
var height = 190;
var radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(['#7fd2c5','#EEEEEE']);

var svg = d3.select('#piechart' + indx)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate (' + (width/2) + ',' + (height/2) + ')');

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(40);

var pie = d3.layout.pie()
    .value(function(d) { return d.count; })
    .sort(null);

var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d,i) {
      return color(d.data.label);
    });
}

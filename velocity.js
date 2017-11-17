// https://bl.ocks.org/ajfarkas/a007097730f23ca0ff32b3e0fde226f6
// store a bunch of time values for the graph
datas = []

function createVelocity() {
  // this is how time would be stored on the server
   var now = Date.now()
  // add datum
  for (v in veloValue){
    times.push({
      time: +now,
      value: +veloValue[v]
    })
  }

  // remove old data
  if (times.length > 120)
    times.shift()
  // define plot boundaries
  var width = 900,
      height = 200
  var margin = {
    top: 20,
    right: 10,
    bottom: 5,
    left: 50
  }
  var plot = {
    width: width - margin.right - margin.left,
    height: height - margin.top - margin.bottom
  }
  // x-axis is time
  var x = d3.time.scale()
    .range([0, plot.width])
  // y-axis is numerical
  var y = d3.scale.linear()
    .range([plot.height, 0])
  // set axis scales
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('center')
    .tickFormat('')
    .tickSize(0, 0)


  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickSize(0, 0).ticks(3)


  // set time span to show
  var timeCap = width  // 12s
  var latest = times.length
    ? times[times.length - 1].time
    : 0
  var data = times.filter(function(d) {
    return d.time >= latest - timeCap
  })
    // console.log("data:",d.time)
    // console.log("times:",times)
  // for (var value in values){
  //   var onevalue = values[value]
  //   onevalue
  // }


  x.domain([latest - timeCap, latest])
  y.domain([-1,1])

  var line = d3.svg.line()
    .x(function(d) { return x(+d.time) })
    .y(function(d) { return y(+d.value) })
  // make the graph
  var svg = d3.select('#velocity')
              .style("width", 900)
              .style('height',250)
  var graph = undefined

  if (d3.select('.graph-g').empty()) {
    graph = svg.append('g')
        .attr('class', 'graph-g')
        .attr('width', plot.width)
        .attr('height', plot.height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    //add axes
    graph.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + plot.height + ')')
        .call(xAxis)
      .append('text')
        .attr('dx', (plot.width / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Time')

    graph.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('dx', (0 - plot.height / 2))
        .attr('dy', '-2.8em')
        .style('text-anchor', 'middle')
        .text('Velocity');
  } else {
    graph = d3.select('.graph-g')
  }

  // remove old line
  graph.select('.line').remove()
  //add data line
  graph.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line)
}

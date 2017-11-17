
var lineFunction = d3.svg.line()
  .x(function(item) { return item.x != undefined? item.x : item.getX(); })
  .y(function(item) { return item.y != undefined? item.y : item.getY(); })
  .interpolate('linear');

var pendulum = {};
pendulum.pivot = {x: 450, y: 30};
pendulum.m = 100; // mass of pendulum bob
pendulum.l = 150; // Length of pendulum, from pivot to center of bob
pendulum.r = 20; // Radius of bob
pendulum.th = 0.8; // Angle of pendulum, measured CW from the vertical downwards position
pendulum.thdot = 0; // Angular velocity of the pendulum
pendulum.getX = function() { return this.pivot.x + this.l * Math.sin(this.th); }
pendulum.getY = function() { return this.pivot.y + this.l * Math.cos(this.th); }
pendulum.update = function(dt) {
  // Get acceleration
  var thddot = - gravity * Math.sin(this.th) / this.l;

  // Update velocity
  this.thdot += thddot * dt;

  // Push the time with the angular velocity into the global array tracking them.
  time_velo_vals.push({ time: +Date.now(), value: +this.thdot })

  //Update position
  this.th += this.thdot * dt;

  // Push the time with the location into the global array tracking them.
  time_loc_vals.push({ time: +Date.now(), value: +this.th })
}

pendulum.draw = function(firstDraw) {
  if (firstDraw) {
    this.rod = p.append('path')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
    this.bob = p.append('circle').data([pendulum])
      .attr('opacity', opacity)
      .attr('fill', 'green');
  }
  this.rod
    .attr('d', lineFunction([this.pivot, this]));

  this.bob
    .attr('cx', function(pendulum) { return pendulum.getX(); })
    .attr('cy', function(pendulum) { return pendulum.getY(); })
    .attr('r', function(pendulum) { return pendulum.r; })
    .attr('opacity', opacity)
  // d3.selectAll('div').data([this.th])
  //   .text(function(d) { return "Theta: " + Math.round((d*180/Math.PI)*10)/10 + " deg"; });
}

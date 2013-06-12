var svg = svg || {};

svg.drawGrid = function(selection, x0, y0, width, height, size) {
  for (var x = Math.ceil(x0 / size) * size; x <= width - x0; x += size) {
    selection.append("line")
      .classed("grid", true)
      .attr("x1", x)
      .attr("y1", y0)
      .attr("x2", x)
      .attr("y2", width - y0)
      ;
  }
  for (var y = Math.ceil(y0 / size) * size; y <= height - y0; y += size) {
    selection.append("line")
      .classed("grid", true)
      .attr("x1", x0)
      .attr("y1", y)
      .attr("x2", height - x0)
      .attr("y2", y)
      ;
  }
};

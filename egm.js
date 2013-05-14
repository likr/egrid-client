"use strict";


var scale = 1;


function resetViewBox() {
  var winWidth = $(document).width();
  var winHeight = $(document).height();
  var viewBox = new ViewBox();
  viewBox.width = scale * winWidth;
  viewBox.height = scale * winHeight;
  viewBox.minX = - viewBox.width / 2;
  viewBox.minY = - viewBox.height / 2;
  d3.select("#contents").attr("viewBox", viewBox.toString());
}


function scaleViewBox() {
  var viewBox = viewBoxFromString(d3.select("#contents").attr("viewBox"));
  var w0 = viewBox.width;
  var h0 = viewBox.height;
  viewBox.width = scale * $(document).width();
  viewBox.height = scale * $(document).height();
  viewBox.minX = viewBox.minX + w0 / 2 - viewBox.width / 2;
  viewBox.minY = viewBox.minY + h0 / 2 - viewBox.height / 2;
  d3.select("#contents").attr("viewBox", viewBox.toString());
}


function resizeViewBox() {
  var winWidth = $(document).width();
  var winHeight = $(document).height();
  var viewBox = viewBoxFromString(d3.select("#contents").attr("viewBox"));
  viewBox.width = winWidth;
  viewBox.height = winHeight;
  d3.select("#contents").attr("viewBox", viewBox.toString());
}


function dragContents() {
  return d3.behavior.drag()
    .on("drag", function() {
      var winWidth = $(document).width();
      var winHeight = $(document).height();
      var viewBox = viewBoxFromString(d3.select("#contents").attr("viewBox"));
      var ratio = winWidth < winHeight
        ? viewBox.width / winWidth
        : viewBox.height / winHeight;
      viewBox.minX -= d3.event.dx * ratio;
      viewBox.minY -= d3.event.dy * ratio;
      d3.select("#contents").attr("viewBox", viewBox.toString());
    })
  ;
}


function zoomIn() {
  scale *= 0.9;  
  scaleViewBox();
}


function zoomOut() {
  scale /= 0.9;
  scaleViewBox();
}

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
  d3.select("#contents")
    .transition()
    .attr("viewBox", viewBox.toString());
}


function scaleViewBox() {
  var viewBox = viewBoxFromString(d3.select("#contents").attr("viewBox"));
  var w0 = viewBox.width;
  var h0 = viewBox.height;
  viewBox.width = scale * $(document).width();
  viewBox.height = scale * $(document).height();
  viewBox.minX = viewBox.minX + w0 / 2 - viewBox.width / 2;
  viewBox.minY = viewBox.minY + h0 / 2 - viewBox.height / 2;
  d3.select("#contents")
    .transition()
    .attr("viewBox", viewBox.toString());
}


function resizeViewBox() {
  var winWidth = $(document).width();
  var winHeight = $(document).height();
  var viewBox = viewBoxFromString(d3.select("#contents").attr("viewBox"));
  viewBox.width = winWidth;
  viewBox.height = winHeight;
  d3.select("#contents")
    .transition()
    .attr("viewBox", viewBox.toString());
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


function dragElement(selection) {
  var source;
  return d3.behavior.drag()
    .on("dragstart", function() {
      source = d3.select(d3.event.sourceEvent.target.parentNode);
      source.classed("dragSource", true);
    })
    .on("dragend", function() {
      var target = d3.select(d3.event.sourceEvent.target.parentNode);
      if (target.datum() && source.datum() != target.datum()
          && source.datum().layer != target.datum().layer) {
        data.links.push({
          source: source.datum().index,
          target: target.datum().index
        });
        draw(data);
      }
      source.classed("dragSource", false);
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


function resetZoom() {
  scale = 1;
  scaleViewBox();
}


function appendElement(selection) {
  var rx = 20;

  selection
    .call(dragElement())
    .classed("element", true)
    ;

  var rect = selection.append("rect")
  selection.append("text")
    .text(function(d) {return d.name || d.text})
    .attr("x", rx)
    .attr("y", function(d) {
      return this.getBBox().height + rx
    })
    ;
  rect.attr("x", 0)
    .attr("y", 0)
    .attr("rx", rx)
    .attr("width", function(d) {
      return this.parentNode.lastChild.getBBox().width + rx * 2
    })
    .attr("height", function(d) {
      return this.parentNode.lastChild.getBBox().height + rx * 2
    })
    ;
}


function translate(node) {
  var str = d3.select(node).attr("transform");
  var vals = str.slice(10, -1).split(",").map(Number);
  return new Translate(vals[0], vals[1]);
}


function draw(data) {
  var hMargin = 50;
  var vMargin = 150;

  var numLayers = data.layers.length;

  var elements = d3.select("#contents").selectAll(".element")
    .data(data.nodes)
    ;
  elements
    .enter()
    .append("g")
    .call(appendElement)
    ;

  var totalHeight = d3.sum(data.layers, function(layerId) {
    return d3.max(
      elements.filter(function(d) {return d.layer == layerId})[0],
      function(element) {return element.getBBox().height});
  }) + vMargin * (numLayers - 1)

  var vOffset = - totalHeight / 2;
  data.layers.forEach(function(layerId) {
    var layerElements = elements.filter(function(d) {return d.layer == layerId});
    var totalWidth = d3.sum(layerElements[0], function(element) {
      return element.getBBox().width;
    }) + hMargin * (layerElements[0].length - 1);

    var hOffset = - totalWidth / 2;
    layerElements
      .attr("transform", function(d) {
        var x = hOffset;
        var y = vOffset;
        hOffset += this.getBBox().width + hMargin;
        return (new Translate(x, y)).toString();
      })
      ;

    vOffset += d3.max(layerElements[0], function(e) {
      return e.getBBox().height;
    }) + vMargin;
  });

  d3.selectAll("#contents .link").remove();
  var links = d3.select("#contents").selectAll(".link")
    .data(data.links)
    .enter()
    .append("line")
    .classed("link", true)
    .each(function(d) {
      var sourceT = translate(elements.filter(function(e) {
        return e.index == d.source;
      }).node());
      var targetT = translate(elements.filter(function(e) {
        return e.index == d.target;
      }).node());
      if (sourceT.y > targetT.y) {
        var tmp = d.source;
        d.source = d.target;
        d.target = tmp; 
      }
    })
    .attr("x1", function(d) {
      var node = elements.filter(function(e) {
        return e.index == d.source;
      }).node();
      return translate(node).x + node.getBBox().width / 2;
    })
    .attr("y1", function(d) {
      var node = elements.filter(function(e) {
        return e.index == d.source;
      }).node();
      return translate(node).y + node.getBBox().height;
    })
    .attr("x2", function(d) {
      var node = elements.filter(function(e) {
        return e.index == d.target;
      }).node();
      return translate(node).x + node.getBBox().width / 2;
    })
    .attr("y2", function(d) {
      var node = elements.filter(function(e) {
        return e.index == d.target;
      }).node();
      return translate(node).y;
    })
    ;
}


function parse(data) {
  var processedFlags = data.map(function() {return false});
  var hasParentFlags = data.map(function() {return false});
  var layers = [];

  while (!processedFlags.every(function(f) {return f})) {
    hasParentFlags.forEach(function(d, i, a) {a[i] = processedFlags[i]});
    data.forEach(function(d, i) {
      if (!processedFlags[i]) {
        d.children.forEach(function(c) {hasParentFlags[c] = true});
      }
    });
    var nextRoots = data.map(function(d, i) {
      return {
        index: i,
        data: d
      };
    }).filter(function(d, i) {
      if (hasParentFlags[i]) {
        return false;
      } else {
        processedFlags[i] = true;
        return true;
      }
    });
    layers.push(nextRoots);
  }
  console.log(layers);

  var links = [];
  layers.forEach(function(layer) {
    layer.forEach(function(d) {
      d.data.children.forEach(function(c) {
        links.push({
          source: d.index,
          target: c
        });
      });
    });
  });
  console.log(links);
}


function hasPath(data, from, to) {
  var checkedFlags = data.map(function() {return false});
  var front = [from];
  while (front.length > 0) {
    var i = front.pop();
    if (i == to) {
      return true;
    }
    if (!checkedFlags[i]) {
      data[i].children.filter(function(d) {return !checkedFlags[d]}).forEach(function(d) {front.push(d)});
    }
  }
  return false;
}

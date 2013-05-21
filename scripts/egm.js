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


function radderUp(selection) {
  var target;
  selection.call(d3.behavior.drag()
    .on("dragstart", function() {
      target = d3.select(".selected");
      target.classed("dragSource", true);
      var pos = d3.mouse(d3.select("#contents").node());
      d3.select("#contents")
        .append("line")
        .classed("dragLine", true)
        .attr("x1", pos[0])
        .attr("y1", pos[1])
        .attr("x2", pos[0])
        .attr("y2", pos[1])
        ;
      d3.event.sourceEvent.stopPropagation();
    })
    .on("drag", function() {
      var x1 = Number(d3.select(".dragLine").attr("x1"));
      var y1 = Number(d3.select(".dragLine").attr("y1"));
      var x2 = d3.event.x;
      var y2 = d3.event.y;
      var theta = Math.atan2(y2 - y1, x2 - x1);
      var r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) - 10;
      d3.select(".dragLine")
        .attr("x2", x1 + r * Math.cos(theta))
        .attr("y2", y1 + r * Math.sin(theta))
        ;
      var pos = getPos();
      var s = d3.select(document.elementFromPoint(pos[0], pos[1]).parentNode);
      var t = d3.select(".selected");
      if (s.classed("element") && !s.classed("selected")) {
        if (hasPath(data.nodes, t.datum().index, s.datum().index)) {
            s.classed("undroppable", true);
          } else {
            s.classed("droppable", true);
          }
      } else {
        d3.selectAll(".droppable, .undroppable")
          .classed("droppable", false)
          .classed("undroppable", false);
      }
    })
    .on("dragend", function() {
      var pos = getPos();
      var source = d3.select(document.elementFromPoint(pos[0], pos[1]).parentNode);
      if (source.datum() && source.datum() != target.datum()) {
        if (!hasPath(data.nodes, target.datum().index, source.datum().index)) {
          if (target.datum().layer <= source.datum().layer) {
            updateLayer(data.nodes, target.datum(), source.datum().layer + 1);
          }
          source.datum().children.push(target.datum().index);
          data.links.push({
            source: source.datum().index,
            target: target.datum().index
          });
          draw(data);
        }
      } else {
        var text = prompt("追加する要素の名前を入力してください");
        if (text) {
          var sourceDatum = {
            index: data.nodes.length,
            text: text,
            layer: target.datum().layer - 1,
            children: []
          }
          data.nodes.push(sourceDatum);
          if (sourceDatum.layer < 0) {
            var delta = - sourceDatum.layer;
            for (var i = 0; i < delta; ++i) {
              data.layers.unshift({});
            }
            data.nodes.forEach(function(node) {
              node.layer += delta;
            });
          }
          sourceDatum.children.push(target.datum().index);
          data.links.push({
            source: sourceDatum.index,
            target: target.datum().index
          });
          draw(data);
        }
      }
      unselectElement();
      target.classed("dragSource", false);
      source.classed("droppable", false);
      source.classed("undroppable", false);
      d3.selectAll(".dragLine").remove();
    }))
    ;
}


function radderDown(selection) {
  var source;
  selection.call(d3.behavior.drag()
    .on("dragstart", function() {
      source = d3.select(".selected");
      source.classed("dragSource", true);
      var pos = d3.mouse(d3.select("#contents").node());
      d3.select("#contents")
        .append("line")
        .classed("dragLine", true)
        .attr("x1", pos[0])
        .attr("y1", pos[1])
        .attr("x2", pos[0])
        .attr("y2", pos[1])
        ;
      d3.event.sourceEvent.stopPropagation();
    })
    .on("drag", function() {
      var x1 = Number(d3.select(".dragLine").attr("x1"));
      var y1 = Number(d3.select(".dragLine").attr("y1"));
      var x2 = d3.event.x;
      var y2 = d3.event.y;
      var theta = Math.atan2(y2 - y1, x2 - x1);
      var r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) - 10;
      d3.select(".dragLine")
        .attr("x2", x1 + r * Math.cos(theta))
        .attr("y2", y1 + r * Math.sin(theta))
        ;
      var pos = getPos();
      var s = d3.select(document.elementFromPoint(pos[0], pos[1]).parentNode);
      var t = d3.select(".selected");
      if (s.classed("element") && !s.classed("selected")) {
        if (hasPath(data.nodes, s.datum().index, t.datum().index)) {
            s.classed("undroppable", true);
          } else {
            s.classed("droppable", true);
          }
      } else {
        d3.selectAll(".droppable, .undroppable")
          .classed("droppable", false)
          .classed("undroppable", false);
      }
    })
    .on("dragend", function() {
      var pos = getPos();
      var target = d3.select(document.elementFromPoint(pos[0], pos[1]).parentNode);
      if (target.datum() && source.datum() != target.datum()) {
        if (!hasPath(data.nodes, target.datum().index, source.datum().index)) {
          if (target.datum().layer <= source.datum().layer) {
            updateLayer(data.nodes, target.datum(), source.datum().layer + 1);
          }
          source.datum().children.push(target.datum().index);
          data.links.push({
            source: source.datum().index,
            target: target.datum().index
          });
          draw(data);
        }
      } else {
        var text = prompt("追加する要素の名前を入力してください");
        if (text) {
          var targetDatum = {
            index: data.nodes.length,
            text: text,
            layer: source.datum().layer + 1,
            children: []
          }
          while (targetDatum.layer >= data.layers.length) {
            data.layers.push({});
          }
          source.datum().children.push(targetDatum.index);
          data.nodes.push(targetDatum);
          data.links.push({
            source: source.datum().index,
            target: targetDatum.index
          });
          draw(data);
        }
      }
      unselectElement();
      target.classed("droppable", false);
      target.classed("undroppable", false);
      source.classed("dragSource", false);
      d3.selectAll(".dragLine").remove();
    }))
    ;
}


function getPos() {
  return d3.event.sourceEvent instanceof MouseEvent
    ? d3.mouse(document.body)
    : d3.touches(document.body, d3.event.sourceEvent.changedTouches)[0];
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
    .classed("element", true)
    .on("click", function() {
      selectElement(this);
      d3.event.stopPropagation();
    })
    ;

  var rect = selection.append("rect")
  selection.append("text")
    .text(function(d) {return d.text})
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


function initData(data) {
  data.links = [];
  data.nodes.forEach(function(d, i) {
    d.index = i;
    d.children.forEach(function(c) {
      data.links.push({
        source: d.index,
        target: c
      });
    });
  });
}


function layout(layers, links) {
  var hMargin = 50;
  var vMargin = 150;

  var totalHeight = d3.sum(layers, function(layer) {
    return d3.max(layer, function(d) {
      return d.height;
    });
  }) + vMargin * (layers.length - 1);

  var vOffset = - totalHeight / 2;
  layers.forEach(function(layer) {
    var totalWidth = d3.sum(layer, function(d) {
      return d.width;
    }) + hMargin * (layer.length - 1);
    var hOffset = - totalWidth / 2;
    layer.forEach(function(d) {
      d.x = hOffset;
      d.y = vOffset;
      hOffset += d.width + hMargin;
    });
    vOffset += d3.max(layer, function(d) {return d.height}) + vMargin;
  });

  var nodes = d3.selectAll(".element").data();
  var connections = nodes.map(function() {
    return nodes.map(function() {return false});
  });
  links.forEach(function(link) {
    connections[link.source][link.target] = true;
    connections[link.target][link.source] = true;
  });
  var dt = 0.1;
  var k = 0.1;
  var l = vMargin;
  var g = 1000000;
  var myu = 0.6;
  var v = nodes.map(function() {return 0});
  var minMargin = 10;
  var count = 1000;
  for (var iter = 0; iter < count; ++iter) {
    nodes.forEach(function (d1, i) {
      var F = 0;
      var x1 = rectCenterX(d1);
      var y1 = rectCenterY(d1);
      nodes.forEach(function (d2, j) {
        if (i != j) {
          var x2 = rectCenterX(d2);
          var y2 = rectCenterY(d2);
          var d = distance(x1, y1, x2, y2);
          var theta = Math.atan2(y2 - y1, x2 - x1);
          if (d1.layer == d2.layer) {
            var minD = 100;
            var d2 = d < minD ? minD : d * d;
            F -= g / d2 * Math.cos(theta);
          }
          if (connections[i][j]) {
            F += k * (d - l) * Math.cos(theta);
          }
        }
      });
      F -= myu * v[i];
      v[i] += F * dt;
      var cx = d3.extent(
          nodes.filter(function(d2) {return d1.layer == d2.layer && d1.index != d2.index}),
          function(d2) {
            var x1 = rectCenterX(d1);
            var x2 = rectCenterX(d2);
            if (Math.abs(x2 - x1) < (d1.width + d2.width) / 2) {
              if (x2 > x1) {
                return (x2 - x1) - (d1.width + d2.width) / 2 - minMargin;
              } else {
                return (d1.width + d2.width) / 2 - (x1 - x2) + minMargin;
              }
            } else {
              return 0;
            }
          });
      d1.x += v[i] * dt + (Math.abs(cx[0]) > Math.abs(cx[1]) ? cx[0] : cx[1]);
    });
  }
}


function distance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}


function draw(data) {
  var layers = data.layers.map(function(layer, i) {
    return data.nodes.filter(function(d) {return d.layer == i});
  });

  d3.select("#contents #elements")
      .selectAll(".element")
      .data(data.nodes)
      .enter()
      .append("g")
      .call(appendElement)
      .each(function(d) {
        var bbox = this.getBBox();
        d.width = bbox.width;
        d.height = bbox.height;
      })
      ;

  d3.select("#contents #links")
      .selectAll(".link")
      .data(data.links)
      .enter()
      .append("line")
      .classed("link", true)
      ;

  layout(layers, data.links);

  var transition = d3.select("#contents").transition();
  transition.selectAll(".element")
      .attr("transform", function(d) {return (new Translate(d.x, d.y)).toString()})
      ;

  transition.selectAll(".link")
      .attr("x1", function(d) {return rectCenterX(data.nodes[d.source])})
      .attr("y1", function(d) {return rectBottom(data.nodes[d.source])})
      .attr("x2", function(d) {return rectCenterX(data.nodes[d.target])})
      .attr("y2", function(d) {return rectTop(data.nodes[d.target])})
      ;
}


function updateLayer(nodes, startNode, depth) {
  startNode.layer = Math.max(depth, startNode.layer);
  while (startNode.layer >= data.layers.length) {
    data.layers.push({});
  }
  startNode.children.forEach(function(c) {
    updateLayer(nodes, nodes[c], depth + 1);
  });
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


function selectElement(node) {
  var d = d3.select(node).datum();
  d3.selectAll(".selected").classed("selected", false);
  d3.selectAll(".connected").classed("connected", false);
  d3.select(node).classed("selected", true);
  d3.select("#radderUpButton")
    .attr("transform", (new Translate(rectCenterX(d), rectTop(d))).toString())
    ;
  d3.select("#radderDownButton")
    .attr("transform", (new Translate(rectCenterX(d), rectBottom(d))).toString())
    ;
  d3.selectAll(".radderButton.invisible")
    .classed("invisible", false)
    ;

  d3.selectAll(".element")
    .filter(function(d2) {
      return hasPath(data.nodes, d.index, d2.index) || hasPath(data.nodes, d2.index, d.index);
    })
    .classed("connected", true)
    ;
}


function unselectElement() {
  d3.selectAll(".selected").classed("selected", false);
  d3.selectAll(".radderButton")
    .classed("invisible", true)
    ;
  d3.selectAll(".connected").classed("connected", false);
}

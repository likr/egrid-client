"use strict";


var scale = 1;


function readGrid(uri) {
  d3.json(uri, function(data) {
    data.nodes.forEach(function (node) {
      var bbox = d3.select("#measure").text(node.text).node().getBBox();
      node.width = bbox.width + 40;
      node.height = bbox.height + 40;
    });
    grid = new egm.Grid(data);
    draw(grid);
  });
}


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


function raddering(selection, isRadderUp) {
  var from;
  selection.call(d3.behavior.drag()
      .on("dragstart", function() {
        from = d3.select(".selected");
        from.classed("dragSource", true);
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
        var to = d3.select(document.elementFromPoint(pos[0], pos[1]).parentNode);
        if (to.classed("element") && !to.classed("selected")) {
          if ((isRadderUp && grid.hasConnection(from.datum(), to.datum()))
            || (!isRadderUp && grid.hasConnection(to.datum(), from.datum()))) {
            to.classed("undroppable", true);
          } else {
            to.classed("droppable", true);
          }
        } else {
          d3.selectAll(".droppable, .undroppable")
            .classed("droppable", false)
            .classed("undroppable", false)
            ;
        }
      })
      .on("dragend", function() {
        var pos = getPos();
        var to = d3.select(document.elementFromPoint(pos[0], pos[1]).parentNode);
        if (to.datum() && from.datum() != to.datum()) {
          grid.transactionWith(function() {
            grid.layoutWith(function() {
              if (isRadderUp) {
                grid.radderUp(from.datum(), to.datum());
              } else {
                grid.radderDown(from.datum(), to.datum());
              }
            });
          });
          draw(grid);
        } else {
          var text = prompt("追加する要素の名前を入力してください");
          if (text) {
            var bbox = d3.select("#measure").text(text).node().getBBox();
            console.log(bbox);
            grid.transactionWith(function() {
              grid.layoutWith(function() {
                if (isRadderUp) {
                  grid.appendNode({
                    text: text, 
                    layer: from.datum().layer - 1,
                    width: bbox.width + 40,
                    height: bbox.height + 40
                  });
                  grid.radderUp(from.datum(), grid.nodes[grid.nodes.length - 1]);
                } else {
                  grid.appendNode({
                    text: text, 
                    layer: from.datum().layer + 1,
                    width: bbox.width + 40,
                    height: bbox.height + 40
                  });
                  grid.radderDown(from.datum(), grid.nodes[grid.nodes.length - 1]);
                }
              });
            });
            draw(grid);
          }
        }
        unselectElement();
        to.classed("droppable", false);
        to.classed("undroppable", false);
        from.classed("dragSource", false);
        d3.selectAll(".dragLine").remove();
      }))
      ;
}


function radderUp(selection) {
  raddering(selection, true);
}


function radderDown(selection) {
  raddering(selection, false);
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


function draw(data) {
  d3.selectAll("#contents #elements .element")
    .data(data.nodes)
    .exit()
    .remove()
    ;
  d3.selectAll("#contents #links .link")
    .data(data.links)
    .exit()
    .remove()
    ;

  d3.select("#contents #elements")
    .selectAll(".element")
    .data(data.nodes)
    .enter()
    .append("g")
    .call(appendElement)
    ;

  d3.select("#contents #links")
    .selectAll(".link")
    .data(data.links)
    .enter()
    .append("line")
    .classed("link", true)
    .attr("x1", function(link) {
      return link.source.prect ? link.source.prect.center().x : 0;
    })
    .attr("y1", function(link) {
      return link.source.prect
        ? link.source.prect.bottom()
        : link.source.rect.height / 2;
    })
    .attr("x2", function(link) {
      return link.target.prect ? link.target.prect.center().x : 0;
    })
    .attr("y2", function(link) {
      return link.target.prect
        ? link.target.prect.top()
        : - link.target.rect.height / 2;
    })
    ;

  var transition = d3.select("#contents").transition();
  transition.selectAll(".element")
    .attr("transform", function(node) {
      return (new Translate(node.rect.x, node.rect.y)).toString();
    })
  ;

  transition.selectAll(".link")
    .attr("x1", function(link) {
      return link.source.rect.center().x;
    })
  .attr("y1", function(link) {
    return link.source.rect.bottom();
  })
  .attr("x2", function(link) {
    return link.target.rect.center().x;
  })
  .attr("y2", function(link) {
    return link.target.rect.top();
  })
  ;

  d3.select("#undoButton").node().disabled = !grid.canUndo();
  d3.select("#redoButton").node().disabled = !grid.canRedo();
}


function selectElement(node) {
  var d = d3.select(node).datum();
  d3.selectAll(".selected").classed("selected", false);
  d3.selectAll(".connected").classed("connected", false);
  d3.select(node).classed("selected", true);
  d3.select("#radderUpButton")
    .attr("transform", (new Translate(d.rect.center().x, d.rect.top())).toString())
    ;
  d3.select("#radderDownButton")
    .attr("transform", (new Translate(d.rect.center().x, d.rect.bottom())).toString())
    ;
  d3.selectAll(".radderButton.invisible")
    .classed("invisible", false)
    ;

  d3.selectAll(".element")
    .filter(function(d2) {
      return grid.hasConnection(d, d2) || grid.hasConnection(d2, d);
    })
    .classed("connected", true)
    ;
  d3.selectAll(".link")
    .filter(function(link) {
      return (grid.hasConnection(d, link.source) && grid.hasConnection(d, link.target))
        || (grid.hasConnection(link.source, d) && grid.hasConnection(link.target, d));
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

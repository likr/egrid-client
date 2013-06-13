"use strict";


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


function initEgm(selection) {
  selection.append("text")
    .attr("id", "measure")
    ;

  selection.append("rect")
    .attr("fill", "none")
    .attr("width", "100%")
    .attr("height", "100%")
    ;

  var contents = selection.append("g")
    .attr("id", "contents")
    ;
  contents.append("g")
    .attr("id", "links")
    ;
  contents.append("g")
    .attr("id", "elements")
    ;

  var radderUpButton = contents.append("g")
    .attr("id", "radderUpButton")
    .classed("radderButton", true)
    .classed("invisible", true)
    .call(radderUp)
    ;
  radderUpButton.append("rect");
  radderUpButton.append("text").text("ラダーアップ");

  var radderDownButton = contents.append("g")
    .attr("id", "radderDownButton")
    .classed("radderButton", true)
    .classed("invisible", true)
    .call(radderDown)
    ;
  radderDownButton.append("rect");
  radderDownButton.append("text").text("ラダーダウン");

  d3.selectAll(".radderButton")
    .each(function() {
      var rx = 10;
      var bbox = this.lastChild.getBBox();
      var width = bbox.width + 2 * rx;
      var height = bbox.height + 2 * rx;
      d3.select(this.firstChild)
        .attr("x", - width / 2)
        .attr("y", - height / 2)
        .attr("rx", rx)
        .attr("width", width)
        .attr("height", height)
        ;
      d3.select(this.lastChild)
        .attr("x", rx - width / 2)
        .attr("y", height / 2 - rx)
        ;
    })
  ;

  var zoomBehavior = d3.behavior.zoom()
    .scale(1)
    .on("zoom", function () {
      var translate = new Translate(d3.event.translate[0], d3.event.translate[1]);
      var scale = new Scale(d3.event.scale);
      contents.attr("transform", translate + scale);
    })
    ;
  selection
    .call(zoomBehavior)
    ;
}


function initAddItemButton(selection) {
  selection.on("click", function() {
    var name = prompt("追加する要素の名前を入力してください");
    if (name) {
      grid.transactionWith(function() {
        var bbox = d3.select("#measure").text(name).node().getBBox();
        grid.appendNode({
          text: name,
          width: bbox.width + 40,
          height: bbox.height + 40
        });
      });
      draw(grid);
      selectElement(d3.select(".element.new").node());
    }
  });
}


function initSaveButton(selection) {
  selection.on("click", function() {
    var form = d3.select("form");
    var field = form.select("input");
    var data = {
      nodes: grid.nodes.map(function(node) {
        return {
          text: node.text,
          children: node.children
        }
      })
    };
    field.attr("value", JSON.stringify(data));
    form.node().submit();
  });
}


function initUndoButton(selection) {
  selection.on("click", function() {
    grid.undo();
    draw(grid);
    unselectElement();
  });
}


function initRedoButton(selection) {
  selection.on("click", function() {
    grid.redo();
    draw(grid);
    unselectElement();
  });
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
          if (isRadderUp) {
            if (!grid.hasConnection(from.datum(), to.datum())
                && !grid.hasLink(to.datum(), from.datum())) {
              grid.radderUp(from.datum(), to.datum());
              draw(grid);
              selectElement(from.node());
            }
          } else {
            if (!grid.hasConnection(to.datum(), from.datum())
                && !grid.hasLink(from.datum(), to.datum())) {
              grid.radderDown(from.datum(), to.datum());
              draw(grid);
              selectElement(from.node());
            }
          }
        } else {
          var text = prompt("追加する要素の名前を入力してください");
          if (text) {
            var bbox = d3.select("#measure").text(text).node().getBBox();
            grid.transactionWith(function() {
              if (isRadderUp) {
                grid.appendNode({
                  text: text, 
                  layer: from.datum().layer - 1,
                  width: bbox.width + 40,
                  height: bbox.height + 40,
                  x: d3.mouse(d3.select("#contents").node())[0],
                  y: d3.mouse(d3.select("#contents").node())[1]
                });
                grid.radderUp(from.datum(), grid.nodes[grid.nodes.length - 1]);
              } else {
                grid.appendNode({
                  text: text, 
                  layer: from.datum().layer + 1,
                  width: bbox.width + 40,
                  height: bbox.height + 40,
                  x: d3.mouse(d3.select("#contents").node())[0],
                  y: d3.mouse(d3.select("#contents").node())[1]
                });
                grid.radderDown(from.datum(), grid.nodes[grid.nodes.length - 1]);
              }
            });
            draw(grid);
            selectElement(from.node());
          }
        }
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


function appendElement(selection) {
  var rx = 20;

  var onElementClick = function() {
    if (d3.select(this).classed("selected")) {
      unselectElement();
      d3.event.stopPropagation();
    } else {
      selectElement(this);
      d3.event.stopPropagation();
    }
  };
  selection
    .classed("element", true)
    .on("click", onElementClick)
    .on("touchstart", onElementClick)
    ;

  var rect = selection.append("rect")
  selection.append("text")
    .text(function(d) {return d.text})
    .attr("x", function(d) {
      return rx - d.rect.width / 2;
    })
    .attr("y", function(d) {
      return rx;
    })
    ;
  rect
    .attr("x", function(d) {
      return - d.rect.width / 2;
    })
    .attr("y", function(d) {
      return - d.rect.height / 2;
    })
    .attr("rx", rx)
    .attr("width", function(d) {
      return d.rect.width;
    })
    .attr("height", function(d) {
      return d.rect.height;
    })
    ;
}


function draw(data) {
  var spline = d3.svg.line()
    .x(function(d) {return d.x})
    .y(function(d) {return d.y})
    .interpolate("basis")
    ;

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

  d3.selectAll("#contents #elements .element.new")
    .classed("new", false)
    ;
  d3.select("#contents #elements")
    .selectAll(".element")
    .data(data.nodes)
    .enter()
    .append("g")
    .classed("new", true)
    .attr("transform", function(node) {
      return new Translate(node.rect.center().x || 0, node.rect.center().y || 0);
    })
    .call(appendElement)
    ;

  d3.select("#contents #links")
    .selectAll(".link")
    .data(data.links)
    .enter()
    .append("path")
    .classed("link", true)
    ;

  data.nodes.forEach(function(node) {
    node.width = node.rect.height;
    node.height = node.rect.width;
  });

  dagre.layout()
    .nodes(data.nodes)
    .edges(data.links)
    .rankSep(200)
    .edgeSep(20)
    .run()
    ;

  d3.selectAll("#contents #links .link")
    .attr("d", function(link) {
      if (!link.points) {
        link.points = [link.source.rect.right(), link.target.rect.left()];
      }
      if (link.dagre.points.length + 2 == link.points.length) {
        return this.getAttribute("d");
      } else {
        if (link.dagre.points.length + 2 > link.points.length) {
          while (link.dagre.points.length + 2 != link.points.length) {
            link.points.unshift(link.points[0]);
          }
        } else {
          link.points.splice(1, link.points.length - link.dagre.points.length - 2);
        }
        return spline(link.points);
      }
    })
    ;
  data.nodes.forEach(function(node) {
    node.rect = new Rect(node.dagre.y, node.dagre.x, node.rect.width, node.rect.height);
    var tmp = node.dagre.x;
    node.dagre.y = node.dagre.y;
    node.dagre.y = tmp;
  });
  data.links.forEach(function(link) {
    link.dagre.points.forEach(function(point) {
      var tmp = point.x;
      point.x = point.y;
      point.y = tmp;
    });
    link.points = link.dagre.points.map(function(p) {return p});
    link.points.unshift(link.source.rect.right());
    link.points.push(link.target.rect.left());
  });


  var transition = d3.select("#contents").transition();
  transition.selectAll(".element")
    .attr("transform", function(node) {
      return (new Translate(node.rect.center().x, node.rect.center().y))
        + (new Rotate(node.rect.theta / Math.PI * 180));
    })
    ;

  transition.selectAll(".link")
    .attr("d", function(link) {
      return spline(link.points);
    })
    ;

  if (d3.select("#undoButton").node()) {
    d3.select("#undoButton").node().disabled = !grid.canUndo();
  }
  if (d3.select("#redoButton").node()) {
    d3.select("#redoButton").node().disabled = !grid.canRedo();
  }
}


function selectElement(node) {
  var d = d3.select(node).datum();
  d3.selectAll(".selected").classed("selected", false);
  d3.selectAll(".connected").classed("connected", false);
  d3.select(node).classed("selected", true);
  d3.select("#radderUpButton")
    .attr("transform", new Translate(d.rect.left().x - 100, d.rect.left().y))
    ;
  d3.select("#radderDownButton")
    .attr("transform", (new Translate(d.rect.right().x + 100, d.rect.right().y)))
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

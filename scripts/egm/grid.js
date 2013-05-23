var egm = egm || {};


(function() {
  function hasPath(nodes, fromIndex, toIndex) {
    var checkedFlags = data.map(function() {return false});
    var front = [fromIndex];
    while (front.length > 0) {
      var i = front.pop();
      if (i == toIndex) {
        return true;
      }
      if (!checkedFlags[i]) {
        data[i].children.filter(function(d) {return !checkedFlags[d]}).forEach(function(d) {front.push(d)});
      }
    }
    return false;
  }


  function connections(nodes) {
    return nodes.map(function(d1, i) {
      return nodes.map(function(d2, j) {
        return hasPath(nodes, i, j);
      });
    });
  }


  var layout = (function(grid) {
    function rowMajorLayout(grid) {
      var hMargin = 50;
      var vMargin = 150;
      var totalHeight = d3.sum(grid.layers, function(layer) {
        return d3.max(layer, function(node) {
          return node.height;
        });
      }) + vMargin * (layers.length - 1);

      var vOffset = - totalHeight / 2;
      grid.layers.forEach(function(layer) {
        var totalWidth = d3.sum(layer, function(node) {
          return node.width;
        }) + hMargin * (layer.length - 1);
        var hOffset = - totalWidth / 2;
        layer.forEach(function(node) {
          node.x = hOffset;
          node.y = vOffset;
          hOffset += d.width + hMargin;
        });
        vOffset += d3.max(layer, function(d) {return d.height}) + vMargin;
      });
    }

    function columnMajorLayout(grid) {
      var hMargin = 150;
      var vMargin = 50;
      var totalWidth = d3.sum(layers, function(layer) {
        return d3.max(layer, function(d) {
          return d.width;
        });
      }) + hMargin * (layers.length - 1);

      var hOffset = - totalWidth / 2;
      layers.forEach(function(layer) {
        var totalHeight = d3.sum(layer, function(d) {
          return d.height;
        }) + vMargin * (layer.length - 1);
        var vOffset = - totalHeight / 2;
        layer.forEach(function(d) {
          d.x = vOffset;
          d.y = hOffset;
          vOffset += d.height + vMargin;
        });
        hOffset += d3.max(layer, function(d) {return d.width}) + hMargin;
      });
    }

    function adjustLayout(nodes, target) {
      var cx = d3.extent(
          nodes.filter(function(node) {
            return targetNode.layer == node.layer && targetNode.index != node.index;
          }),
          function(node) {
            var x1 = target.rect.center.x;
            var x2 = node.rect.center.x;
            if (Math.abs(x2 - x1) < (target.width + node.width) / 2) {
              if (x2 > x1) {
                return (x2 - x1) - (target.width + node.width) / 2;
              } else {
                return (target.width + node.width) / 2 - (x1 - x2);
              }
            } else {
              return 0;
            }
          });
      if (cx[0] || cx[1]) {
        target.x += (Math.abs(cx[0]) > Math.abs(cx[1]) ? cx[0] : cx[1]);
      }
    }

    function forceLayout(grid) {
      function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
      }

      var dt = 0.1;
      var k = 0.1;
      var l = vMargin;
      var g = 1000000;
      var myu = 0.3;
      var stop = 1000;
      var v = nodes.map(function() {return new Vector(0, 0)});

      for (var loop = 0; loop < stop; ++loop) {
        grid.nodes.forEach(function(d1, i) {
          var F = new Vector();
          var p1 = d1.rect.center();
          grid.nodes.forEach(function(d2, i) {
            if (i != j) {
              var p2 = d2.rect.center();
              var d = p1.distanceTo(p2);
              var theta = p1.angleTo(p2);
              if (d1.layer == d2.layer) {
                var d2 = Math.max(d * d, 100);
                F.x -= g / d2 * Math.cos(theta);
                F.y -= g / d2 * Math.sin(theta);
              }
              if (grid.hasConnection(d1, d2)) {
                F.x += k * (d - l) * Math.cos(theta);
                F.y += k * (d - l) * Math.sin(theta);
              }
            }
          });
          F.x -= myu * v[i].x;
          F.y -= myu * v[i].y;
          v[i].x += F.x * dt;
          //v[i].y += F.y * dt;
          d1.x += v[i].x * dt;
          dx.y += v[i].y * dt;

          adjustLayout(grid.nodes, i);
        });
      }
    }

    return function layout(grid) {
      if (grid.columnMajorLayout) {
        columnMajorLayout(grid);
        forceLayout(grid);
      } else {
        rowMajorLayout(grid);
      }
    };
  })();


  egm.Grid = function Grid(data) {
    this.baseLayer = data.baseLayer;

    this.layers = data.layers.map(function(layer, i) {
      return new this.Layer(data.nodes.filter(function(node) {
        return node.layer == i;
      }));
    });
    this.layers.forEach(function(layer, i) {
      layer.index = i;
    });

    this.nodes = data.nodes.map(function(node, i) {
      return new this.Node();
    });
    this.nodes.forEach(function(node, i) {
      node.index = i;
    });

    this.links = [];
    this.nodes.forEach(function(d) {
      d.children.forEach(function(c) {
        this.links.push(new this.Link(d.index, c));
      });
    });

    this.connections = connections(this.nodes);
  };


  egm.Grid.prototype.hasConnection = function hasPath(fromIndex, toIndex) {
    return this.connections[fromIndex][toIndex];
  };


  egm.Grid.prototype.appendNode = function appendNode(obj) {
    var node = new this.Node(obj);
    node
    this.nodes.push(node);
  };


  egm.Grid.prototype.appendLink = function appendLink(fromIndex, toIndex) {
    if (this.hasConnection(toIndex, fromIndex)) {
      throw new Error("the new link makes cyclic connection");
    }
    var fromNode = this.nodes[fromIndex];
    var toNode = this.nodes[toIndex];
    this.links.push(new this.Link(fromIndex, toIndex));
  };


  egm.Grid.prototype.Node = function Node() {
  };


  egm.Grid.prototype.Link = (function() {
    grid = this;
    return function Link(fromIndex, toIndex, weight) {
      this.source = grid.nodes[fromIndex];
      this.target = grid.nodes[toIndex];
      this.weight = weight === undefined ? 1 : weight;
    };
  })();


  egm.Grid.prototype.Layer = (function() {
    grid = this;
    return function Layer(nodes) {
      this.nodes = nodes;
      this.totalWidth = d3.sum(this.nodes, function(node) {return node.width});
      this.maxWidth = d3.max(this.nodes, function(node) {return node.width});
      this.totalHeight = d3.sum(this.nodes, function(node) {return node.height});
      this.maxHeight = d3.max(this.nodes, function(node) {return node.height});
    };
  })();
})();



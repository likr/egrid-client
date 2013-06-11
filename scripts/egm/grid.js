var egm = egm || {};


(function() {
  function hasPath(nodes, fromIndex, toIndex) {
    var checkedFlags = nodes.map(function() {return false});
    var front = [fromIndex];
    while (front.length > 0) {
      var i = front.pop();
      if (i == toIndex) {
        return true;
      }
      if (!checkedFlags[i]) {
        nodes[i].children.filter(function(d) {
          return !checkedFlags[d];
        }).forEach(function(d) {
          front.push(d);
        });
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
    function baseLayout(grid, rowMajor) {
      if (rowMajor) {
        var hMargin = 50;
        var vMargin = 250;
      } else {
        var hMargin = 250;
        var vMargin = 50
      }
      var layerRange = d3.extent(grid.nodes, function(node) {
        return node.layer;
      });
      var layers = [];
      for (var k = layerRange[0]; k <= layerRange[1]; ++k) {
        var layer = {
          nodes: grid.nodes.filter(function(node) {return node.layer == k})
        };
        layer.nodes.sort(function(node1, node2) {
          return (node1.rect.x || 0) - (node2.rect.x || 0);
        });
        layers.push(layer);
      }
      if (rowMajor) {
        var totalSize = d3.sum(layers, function(layer) {
          return d3.max(layer.nodes, function(node) {
            return node.rect.height;
          });
        }) + vMargin * (layers.length - 1);
      } else {
        var totalSize = d3.sum(layers, function(layer) {
          return d3.max(layer.nodes, function(node) {
            return node.rect.width;
          });
        }) + hMargin * (layers.length - 1);
      }

      var layerOffset = - totalSize / 2;
      layers.forEach(function(layer) {
        if (rowMajor) {
          var layerSize = d3.sum(layer.nodes, function(node) {
            return node.rect.width;
          }) + hMargin * (layer.nodes.length - 1);
        } else {
          var layerSize = d3.sum(layer.nodes, function(node) {
            return node.rect.height;
          }) + vMargin * (layer.nodes.length - 1);
        }
        var offset = - layerSize / 2;
        layer.nodes.forEach(function(node) {
          if (rowMajor) {
            node.rect.x = offset;
            node.rect.y = layerOffset;
            offset += node.rect.width + hMargin;
          } else {
            node.rect.x = layerOffset;
            node.rect.y = offset;
            offset += node.rect.height + vMargin;
          }
        });
        if (rowMajor) {
          layerOffset += d3.max(layer.nodes, function(node) {
            return node.rect.height;
          }) + vMargin;
        } else {
          layerOffset += d3.max(layer.nodes, function(node) {
            return node.rect.width;
          }) + hMargin;
        }
      });
    }


    function adjustLayout(nodes, target, rowMajor) {
      if (rowMajor) {
        var cx = d3.extent(
            nodes.filter(function(node) {
              return target.layer == node.layer && target.index != node.index;
            }),
            function(node) {
              var x1 = target.rect.center().x;
              var x2 = node.rect.center().x;
              var realDistance = Math.abs(x2 - x1);
              var expectedDistance = (target.rect.width + node.rect.width) / 2;
              if (realDistance < expectedDistance) {
                if (x2 > x1) {
                  return realDistance - expectedDistance;
                } else {
                  return expectedDistance - realDistance;
                }
              } else {
                return 0;
              }
            });
        if (cx[0] || cx[1]) {
          target.rect.x += (Math.abs(cx[0]) > Math.abs(cx[1]) ? cx[0] : cx[1]);
        }
      } else {
        var cy = d3.extent(
            nodes.filter(function(node) {
              return target.layer == node.layer && target.index != node.index;
            }),
            function(node) {
              var y1 = target.rect.center().y;
              var y2 = node.rect.center().y;
              var realDistance = Math.abs(y2 - y1);
              var expectedDistance = (target.rect.height + node.rect.height) / 2;
              if (realDistance < expectedDistance) {
                if (y2 > y1) {
                  return realDistance - expectedDistance;
                } else {
                  return expectedDistance - realDistance;
                }
              } else {
                return 0;
              }
            });
        if (cy[0] || cy[1]) {
          target.rect.y += (Math.abs(cy[0]) > Math.abs(cy[1]) ? cy[0] : cy[1]);
        }
      }
    }


    function forceLayout(grid, rowMajor) {
      function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
      }

      var dt = 1;
      var k = 0.1;
      var l = 150;
      var g = 100000;
      var myu = 0.5;
      var stop = 500;
      var v = grid.nodes.map(function() {return new Vector(0, 0)});

      for (var loop = 0; loop < stop; ++loop) {
        grid.nodes.forEach(function(d1, i) {
          var F = new Vector();
          var p1 = d1.rect.center();
          grid.nodes.forEach(function(d2, j) {
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
          v[i].y += F.y * dt;
          if (rowMajor) {
            d1.rect.x += v[i].x * dt;
          } else {
            d1.rect.y += v[i].y * dt;
          }

          adjustLayout(grid.nodes, d1, rowMajor);
        });
      }
    }

    return function layout(grid) {
      grid.connections = connections(grid.nodes);
      //grid.circleLayout();
      grid.nodes.forEach(function(node, i) {
        grid.updateNode(
          i,
          {prect: new Rect(node.rect.x, node.rect.y, node.rect.width, node.rect.height)});
      });
      if (grid.columnMajorLayout) {
        baseLayout(grid, false);
        forceLayout(grid, false);
      } else {
        baseLayout(grid, true);
        forceLayout(grid, true);
      }
    };
  })();


  egm.Grid = function Grid(data, columnMajorLayout) {
    var grid = this;

    grid.columnMajorLayout = !!columnMajorLayout
    grid.baseLayer = data.baseLayer;

    grid.nodes = data.nodes.map(function(node) {
      return new Node(node);
    });
    grid.nodes.forEach(function(node, i) {
      node.index = i;
    });

    grid.links = [];
    grid.nodes.forEach(function(d) {
      d.children.forEach(function(c) {
        grid.links.push(new Link(d, grid.nodes[c]));
      });
    });

    layout(grid);

    grid.undoStack = [];
    grid.redoStack = [];
  };


  egm.Grid.prototype.layout = function() {
    layout(this);
  };


  egm.Grid.prototype.circleLayout = function() {
    grid = this;

    var layers = [];
    var layerRange = d3.extent(grid.nodes, function(node) {
      return node.layer;
    });
    for (var k = layerRange[0]; k <= layerRange[1]; ++k) {
      var layer = {
        nodes: grid.nodes.filter(function(node) {return node.layer == k})
      };
      layer.nodes.sort(function(node1, node2) {
        return (node1.rect.x || 0) - (node2.rect.x || 0);
      });
      layers.push(layer);
    }

    d3.selectAll(".guideCircle").remove();
    var layerOffset = 0;
    layers.forEach(function(layer) {
      var sumHeight = d3.sum(layer.nodes, function(node) {return node.rect.height});
      var radius = Math.max(layerOffset, sumHeight / 2 / Math.PI);
      d3.select("#contents").append("circle").attr("r", radius).style("fill", "none").style("stroke", "red").classed("guideCircle", true);
      var deltaTheta = 2 * Math.PI / layer.nodes.length;
      var theta = 0;
      layer.nodes.forEach(function(node) {
        node.rect.theta = theta;
        node.rect.x = Math.cos(theta) * radius;
        node.rect.y = Math.sin(theta) * radius;
        theta -= deltaTheta;
      });
      layerOffset = radius + d3.max(layer.nodes, function(node) {return node.rect.width}) + 100;
    });


    function Vector(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }

    var dt = 1;
    var k = 1;
    var l = 50;
    var g = 1000;
    var myu = 0.5;
    var stop = 500;
    var v = grid.nodes.map(function() {return new Vector(0, 0)});

    for (var loop = 0; loop < stop; ++loop) {
      grid.nodes.forEach(function(d1, i) {
        var F = new Vector();
        var p1 = d1.rect.center();
        grid.nodes.forEach(function(d2, j) {
          if (i != j) {
            var p2 = d2.rect.center();
            var d = p1.distanceTo(p2);
            var theta = p1.angleTo(p2);
            //if (d1.layer == d2.layer) {
            //  var d2 = Math.max(d * d, 100);
            //  F.x -= g / d2 * Math.cos(theta);
            //  F.y -= g / d2 * Math.sin(theta);
            //}
            if (grid.hasConnection(d1, d2)) {
              F.x += k * (d - l) * Math.cos(theta);
              F.y += k * (d - l) * Math.sin(theta);
            }
          }
        });
        F.x -= myu * v[i].x;
        F.y -= myu * v[i].y;
        v[i].x += F.x * dt;
        v[i].y += F.y * dt;

        var r = Math.sqrt(d1.rect.x * d1.rect.x + d1.rect.y * d1.rect.y);
        d1.rect.theta += (F.x * Math.sin(d1.rect.theta) + F.y * Math.cos(d1.rect.theta)) * dt / 2 / Math.PI / r;
        d1.rect.x = r * Math.cos(d1.rect.theta);
        d1.rect.y = r * Math.sin(d1.rect.theta);

        //adjustLayout(grid.nodes, d1, rowMajor);
      });
    }
  };


  egm.Grid.prototype.hasConnection = function hasPath(from, to) {
    var fromIndex = typeof from == "number" ? from : from.index;
    var toIndex = typeof to == "number" ? to : to.index;
    return this.connections[fromIndex][toIndex];
  };


  egm.Grid.prototype.radderUp = function radderUp(from, to) {
    var grid = this;
    if (typeof from == "number") {
      from = grid.nodes[from];
    }
    if (typeof to == "number") {
      to = grid.nodes[to];
    }
    if (grid.hasConnection(from.index, to.index)) {
      throw new Error("the new link makes cyclic connection");
    }
    grid.updateNode(
        to.index,
        {children: (function() {var a = to.children.slice(); a.push(from.index); return a})()}
    );
    grid.appendLink(new Link(to, from));
    if (to.layer >= from.layer) {
      var delta = to.layer - from.layer + 1;
      grid.nodes.forEach(function(node) {
        if (grid.hasConnection(node.index, to.index)) {
          grid.updateNode(node.index, {layer: node.layer - delta});
        }
      });
    }
  };


  egm.Grid.prototype.radderDown = function radderDown(from, to) {
    var grid = this;
    if (typeof from == "number") {
      from = grid.nodes[from];
    }
    if (typeof to == "number") {
      to = grid.nodes[to];
    }
    if (grid.hasConnection(to.index, from.index)) {
      throw new Error("the new link makes cyclic connection");
    }
    grid.updateNode(
        from.index,
        {children: (function() {var a = from.children.slice(); a.push(to.index); return a})()}
    );
    grid.appendLink(new Link(from, to));
    if (to.layer <= from.layer) {
      var delta = from.layer - to.layer + 1;
      grid.nodes.forEach(function(node) {
        if (grid.hasConnection(to.index, node.index)) {
          grid.updateNode(node.index, {layer: node.layer + delta});
        }
      });
    }
  };


  egm.Grid.prototype.undo = function undo() {
    var grid = this;
    var commands = grid.undoStack.pop();
    commands.revert();
    grid.redoStack.push(commands);
    layout(grid);
  };


  egm.Grid.prototype.canUndo = function canUndo() {
    return grid.undoStack.length > 0;
  };


  egm.Grid.prototype.redo = function redo() {
    var commands = grid.redoStack.pop();
    commands.execute();
    grid.undoStack.push(commands);
    layout(grid);
  };


  egm.Grid.prototype.canRedo = function canRedo() {
    return grid.redoStack.length > 0;
  };


  egm.Grid.prototype.transactionWith = function transactionWith(f) {
    this.transaction = new CommandTransaction(this);
    f.call(this);
    this.undoStack.push(this.transaction);
    this.redoStack = [];
    this.transaction = undefined;
  };


  egm.Grid.prototype.layoutWith = function layoutWith(f) {
    f.call();
    layout(grid);
  };


  egm.Grid.prototype.execute = function execute(command) {
    if (this.transaction) {
      this.transaction.commands.push(command);
    }
    command.execute();
  };


  egm.Grid.prototype.appendNode = function appendNode(node) {
    var grid = this;
    var node = new Node(node);
    node.index = grid.nodes.length;
    var command = {
      execute: function() {
        grid.nodes.push(node);
        grid.connections.push(grid.connections.map(function() {return false}));
        grid.connections.forEach(function(row) {
          row.push(false);
        });
      },
      revert: function() {
        grid.nodes.pop();
        grid.connections.pop();
        grid.connections.forEach(function(row) {
          row.pop();
        });
      }
    };
    this.execute(command);
  };


  egm.Grid.prototype.appendLink = function appendLink(link) {
    var grid = this;
    var command = {
      execute: function() {
        grid.links.push(link);
        grid.connections = connections(grid.nodes);
      },
      revert: function() {
        grid.links.pop();
        grid.connections = connections(grid.nodes);
      }
    };
    this.execute(command);
  };


  egm.Grid.prototype.updateNode = function updateNode(index, attributes) {
    var grid = this;
    var previousAttributes = {};
    var command = {
      execute: function() {
        var node = grid.nodes[index];
        for (var key in attributes) {
          previousAttributes[key] = node[key];
          node[key] = attributes[key];
        }
      },
      revert: function() {
        var node = grid.nodes[index];
        for (var key in previousAttributes) {
          node[key] = previousAttributes[key];
        }
      }
    };
    this.execute(command);
  };


  function Node(obj) {
    this.text = obj.text;
    this.layer = obj.layer || 0;
    this.children = obj.children || [];
    this.rect = new Rect(obj.x, obj.y, obj.width, obj.height);
  }


  function Link(fromNode, toNode, weight) {
    this.source = fromNode;
    this.target = toNode;
    this.weight = weight === undefined ? 1 : weight;
  }


  function CommandTransaction(grid) {
    this.grid = grid;
    this.commands = [];
  }


  CommandTransaction.prototype.execute = function execute() {
    this.commands.forEach(function(command) {
      command.execute();
    });
  };


  CommandTransaction.prototype.revert = function revert() {
    this.commands.reverse().forEach(function(command) {
      command.revert();
    });
    this.commands.reverse();
  };
})();

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
    function rowMajorLayout(grid) {
      var hMargin = 50;
      var vMargin = 250;
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
      var totalHeight = d3.sum(layers, function(layer) {
        return d3.max(layer.nodes, function(node) {
          return node.rect.height;
        });
      }) + vMargin * (layers.length - 1);

      var vOffset = - totalHeight / 2;
      layers.forEach(function(layer) {
        var totalWidth = d3.sum(layer.nodes, function(node) {
          return node.rect.width;
        }) + hMargin * (layer.nodes.length - 1);
        var hOffset = - totalWidth / 2;
        layer.nodes.forEach(function(node) {
          node.rect.x = hOffset;
          node.rect.y = vOffset;
          hOffset += node.rect.width + hMargin;
        });
        vOffset += d3.max(layer.nodes, function(node) {
          return node.rect.height;
        }) + vMargin;
      });
    }


    function adjustLayout(nodes, target) {
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
    }


    function forceLayout(grid) {
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
                //F.y -= g / d2 * Math.sin(theta);
              }
              if (grid.hasConnection(d1, d2)) {
                F.x += k * (d - l) * Math.cos(theta);
                //F.y += k * (d - l) * Math.sin(theta);
              }
            }
          });
          F.x -= myu * v[i].x;
          //F.y -= myu * v[i].y;
          v[i].x += F.x * dt;
          //v[i].y += F.y * dt;
          d1.rect.x += v[i].x * dt;
          //d1.rect.y += v[i].y * dt;

          adjustLayout(grid.nodes, d1);
        });
      }
    }

    return function layout(grid) {
      grid.connections = connections(grid.nodes);
      grid.nodes.forEach(function(node, i) {
        grid.updateNode(
          i,
          {prect: new Rect(node.rect.x, node.rect.y, node.rect.width, node.rect.height)});
      });
      if (grid.columnMajorLayout) {
        columnMajorLayout(grid);
        forceLayout(grid);
      } else {
        rowMajorLayout(grid);
        forceLayout(grid);
      }
    };
  })();


  egm.Grid = function Grid(data) {
    var grid = this;

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

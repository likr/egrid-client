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
      var vMargin = 150;
      var layerRange = d3.extent(grid.nodes, function(node) {
        return node.layer;
      });
      var layers = [];
      for (var k = layerRange[0]; k <= layerRange[1]; ++k) {
        layers.push({
          nodes: grid.nodes.filter(function(node) {return node.layer == k})
        });
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

      var dt = 0.1;
      var k = 0.1;
      var l = 150;
      var g = 1000000;
      var myu = 0.3;
      var stop = 1000;
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
      grid.nodes.forEach(function(node) {
        node.prect =
          new Rect(node.rect.x, node.rect.y, node.rect.width, node.rect.height);
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


  function execute(grid, commands) {
  }


  function revert(grid, commands) {
  }


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

    grid.connections = connections(grid.nodes);

    layout(grid);

    grid.undoStack = [];
    grid.redoStack = [];
  };


  egm.Grid.prototype.hasConnection = function hasPath(from, to) {
    var fromIndex = typeof from == "number" ? from : from.index;
    var toIndex = typeof to == "number" ? to : to.index;
    return this.connections[fromIndex][toIndex];
  };


  egm.Grid.prototype.appendNode = function appendNode(obj) {
    var node = new Node(obj);
    node.index = this.nodes.length;
    this.nodes.push(node);
    grid.connections = connections(grid.nodes);
  };


  egm.Grid.prototype.radderUp = function radderDown(from, to) {
    var grid = this;
    var transaction = new CommandTransaction(grid);
    if (typeof from == "number") {
      from = grid.nodes[from];
    }
    if (typeof to == "number") {
      to = grid.nodes[to];
    }
    if (grid.hasConnection(from.index, to.index)) {
      throw new Error("the new link makes cyclic connection");
    }
    transaction.updateNode(
        to.index,
        {children: (function() {var a = to.children.slice(); a.push(from.index); return a})()}
    );
    transaction.appendLink(new Link(to, from));
    if (to.layer >= from.layer) {
      var delta = from.layer - to.layer + 1;
      grid.nodes.forEach(function(node) {
        if (grid.hasConnection(node.index, to.index)) {
          transaction.updateNode(node.index, {layer: node.layer - delta});
        }
      });
    }
    grid.connections = connections(grid.nodes);
    transaction.execute();
    this.undoStack.push(transaction);
    layout(grid);
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
    from.children.push(to.index);
    grid.links.push(new Link(from, to));
    if (to.layer <= from.layer) {
      var delta = from.layer - to.layer + 1;
      grid.nodes.forEach(function(node) {
        if (grid.hasConnection(to.index, node.index)) {
          node.layer += delta;
        }
      });
    }
    grid.connections = connections(grid.nodes);
    layout(grid);
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


  function AppendNodeCommand(grid, node) {
    this.grid = grid;
    this.node = node;
    this.executed = false;
  }


  AppendNodeCommand.prototype.execute = function execute() {
    if (this.executed) {
      throw new Error("this command already executed.");
    }
    this.grid.nodes.push(node);
    this.executed = true;
  };


  AppendNodeCommand.prototype.revert = function revert() {
    if (!this.executed) {
      throw new Error("this command have not been executed yet.");
    }
    this.grid.nodes.pop();
    this.executed = false;
  };


  function RemoveNodeCommand(grid, index) {
    this.grid = grid;
    this.index = index;
    this.executed = false;
  }


  RemoveNodeCommand.prototype.execute = function execute() {
    this.removedNode = this.grid.nodes[this.index];
    this.grid.nodes[this.index] = undefined;
  };


  RemoveNodeCommand.prototype.revert = function revert() {
    this.grid.nodes[this.index] = this.removedNode;
    this.removedNode = undefined;
  };


  function UpdateNodeCommand(grid, index, attributes) {
    this.grid = grid;
    this.index = index;
    this.attributes = attributes;
    this.executed = false;
  }


  UpdateNodeCommand.prototype.execute = function execute() {
    var node = this.grid.nodes[this.index];
    this.previousAttributes = {};
    for (var key in this.attributes) {
      this.previousAttributes[key] = node[key];
      node[key] = this.attributes[key];
    }
  };


  UpdateNodeCommand.prototype.revert = function revert() {
    var node = this.grid.nodes[this.index];
    for (var key in this.previousAttributes) {
      node[key] = this.previousAttributes[key];
    }
  };


  function AppendLinkCommand(grid, link) {
    this.grid = grid;
    this.link = link;
  }


  AppendLinkCommand.prototype.execute = function execute() {
    this.grid.links.push(this.link);
  };


  AppendLinkCommand.prototype.revert = function revert() {
    this.grid.links.pop();
  };


  function CommandTransaction(grid) {
    this.grid = grid;
    this.commands = [];
  }


  CommandTransaction.prototype.appendNode = function appendNode(node) {
    this.commands.push(new AppendNodeCommand(this.grid, node));
  };


  CommandTransaction.prototype.removeNode = function removeNode(index) {
    this.commands.push(new RemoveNodeCommand(this.grid, index));
  };


  CommandTransaction.prototype.updateNode = function updateNode(index, attributes) {
    this.commands.push(new UpdateNodeCommand(this.grid, index, attributes));
  };


  CommandTransaction.prototype.appendLink = function appendLink(link) {
    this.commands.push(new AppendLinkCommand(this.grid, link));
  };


  CommandTransaction.prototype.execute = function execute() {
    this.commands.forEach(function(command) {
      command.execute();
    });
  };


  CommandTransaction.prototype.revert = function revert() {
    this.commands.reverse().forEach(function(command) {
      command.revert();
    });
  };
})();

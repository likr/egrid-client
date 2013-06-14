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
          return !checkedFlags[d.index];
        }).forEach(function(d) {
          front.push(d.index);
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


  egm.Grid = function Grid(data) {
    var grid = this;

    grid.baseLayer = data.baseLayer;

    grid.nodes = data.nodes.map(function(node) {
      return new Node(node);
    });
    grid.nodes.forEach(function(node, i) {
      node.index = i;
      node.children = node.children.map(function(c) {
        return grid.nodes[c];
      });
    });

    grid.links = [];
    grid.nodes.forEach(function(d) {
      d.children.forEach(function(c) {
        grid.links.push(new Link(d, c));
      });
    });

    grid.connections = connections(grid.nodes);

    grid.undoStack = [];
    grid.redoStack = [];
  };


  egm.Grid.prototype.hasConnection = function hasPath(from, to) {
    var fromIndex = typeof from == "number" ? from : from.index;
    var toIndex = typeof to == "number" ? to : to.index;
    return this.connections[fromIndex][toIndex];
  };


  egm.Grid.prototype.hasLink = function (from, to) {
    var fromIndex = typeof from == "number" ? from : from.index;
    var toIndex = typeof to == "number" ? to : to.index;
    return this.links.some(function(link) {
      return (link.source.index == fromIndex && link.target.index == toIndex);
    });
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
        {children: (function() {var a = to.children.slice(); a.push(from); return a})()}
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
        {children: (function() {var a = from.children.slice(); a.push(to); return a})()}
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
  };


  egm.Grid.prototype.canUndo = function canUndo() {
    return grid.undoStack.length > 0;
  };


  egm.Grid.prototype.redo = function redo() {
    var commands = grid.redoStack.pop();
    commands.execute();
    grid.undoStack.push(commands);
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


  egm.Grid.prototype.removeNode = function(index) {
    var grid = this;
    var removedNode = grid.nodes[index];
    var previousLinks;
    var parentNodes = [];
    var command = {
      execute: function() {
        grid.nodes.splice(index, 1);
        grid.nodes.forEach(function(node, i) {
          node.index = i;
          node.children = node.children.filter(function(c) {
            if (c == removedNode) {
              parentNodes.push(node);
              return false;
            } else {
              return true;
            }
          });
        });
        previousLinks = grid.links;
        grid.links = grid.links.filter(function(link) {
          return link.source != removedNode && link.target != removedNode;
        });
        grid.connections = connections(grid.nodes);
      },
      revert: function() {
        grid.nodes.splice(index, 0, removedNode);
        grid.nodes.forEach(function(node, i) {
          node.index = i;
        });
        parentNodes.forEach(function(node) {
          node.children.push(removedNode);
        });
        grid.links = previousLinks;
        grid.connections = connections(grid.nodes);
      }
    };
    grid.execute(command);
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


  var nodeId = 0;
  function Node(obj) {
    this.key = ++nodeId;
    this.text = obj.text;
    this.layer = obj.layer || 0;
    this.children = obj.children || [];
    this.rect = new Rect(obj.x, obj.y, obj.width, obj.height);
  }


  var linkId = 0;
  function Link(fromNode, toNode, weight) {
    this.key = ++linkId;
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

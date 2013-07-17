var Svg;
(function (Svg) {
    (function (Transform) {
        var Translate = (function () {
            function Translate(x, y) {
                this.x = x;
                this.y = y;
            }
            Translate.prototype.toString = function () {
                return "translate(" + this.x + "," + this.y + ")";
            };
            return Translate;
        })();
        Transform.Translate = Translate;

        var Scale = (function () {
            function Scale(sx, sy) {
                if (typeof sy === "undefined") { sy = undefined; }
                this.sx = sx;
                this.sy = sy;
            }
            Scale.prototype.toString = function () {
                if (this.sy) {
                    return "scale(" + this.sx + "," + this.sy + ")";
                } else {
                    return "scale(" + this.sx + ")";
                }
            };
            return Scale;
        })();
        Transform.Scale = Scale;

        var Rotate = (function () {
            function Rotate(angle) {
                this.angle = angle;
            }
            Rotate.prototype.toString = function () {
                return "rotate(" + this.angle + ")";
            };
            return Rotate;
        })();
        Transform.Rotate = Rotate;
    })(Svg.Transform || (Svg.Transform = {}));
    var Transform = Svg.Transform;

    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    })();
    Svg.Point = Point;

    var Rect = (function () {
        function Rect(x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.theta = theta;
        }
        Rect.prototype.left = function () {
            return new Point(-this.width / 2 * Math.cos(this.theta) + this.x, this.width / 2 * Math.sin(this.theta) + this.y);
        };

        Rect.prototype.right = function () {
            return new Point(this.width / 2 * Math.cos(this.theta) + this.x, this.width / 2 * Math.sin(this.theta) + this.y);
        };

        Rect.prototype.top = function () {
            return new Point(this.height / 2 * Math.sin(this.theta) + this.x, -this.height / 2 * Math.cos(this.theta) + this.y);
        };

        Rect.prototype.bottom = function () {
            return new Point(this.height / 2 * Math.sin(this.theta) + this.x, this.height / 2 * Math.cos(this.theta) + this.y);
        };

        Rect.prototype.center = function () {
            return new Point(this.x, this.y);
        };

        Rect.left = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(-width / 2 * Math.cos(theta) + x, width / 2 * Math.sin(theta) + y);
        };

        Rect.right = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(width / 2 * Math.cos(theta) + x, width / 2 * Math.sin(theta) + y);
        };

        Rect.top = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(height / 2 * Math.sin(theta) + x, -height / 2 * Math.cos(theta) + y);
        };

        Rect.bottom = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(height / 2 * Math.sin(theta) + x, height / 2 * Math.cos(theta) + y);
        };

        Rect.center = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(x, y);
        };
        return Rect;
    })();
    Svg.Rect = Rect;
})(Svg || (Svg = {}));
var Egm;
(function (Egm) {
    var Node = (function () {
        function Node() {
            this.x = 0;
            this.y = 0;
            this.theta = 0;
            this.weight = 1;
            this.key = Node.nextKey++;
        }
        Node.prototype.left = function () {
            return Svg.Rect.left(this.x, this.y, this.width, this.height);
        };

        Node.prototype.right = function () {
            return Svg.Rect.right(this.x, this.y, this.width, this.height);
        };

        Node.prototype.top = function () {
            return Svg.Rect.top(this.x, this.y, this.width, this.height);
        };

        Node.prototype.bottom = function () {
            return Svg.Rect.bottom(this.x, this.y, this.width, this.height);
        };

        Node.prototype.center = function () {
            return Svg.Rect.center(this.x, this.y, this.width, this.height);
        };

        Node.prototype.toString = function () {
            return this.key.toString();
        };
        Node.nextKey = 0;
        return Node;
    })();
    Egm.Node = Node;

    var Link = (function () {
        function Link(source, target) {
            this.source = source;
            this.target = target;
            this.weight = 1;
            this.key = Link.nextKey++;
        }
        Link.prototype.toString = function () {
            return this.key.toString();
        };
        Link.nextKey = 0;
        return Link;
    })();
    Egm.Link = Link;

    var CommandTransaction = (function () {
        function CommandTransaction() {
            this.commands = [];
        }
        CommandTransaction.prototype.execute = function () {
            this.commands.forEach(function (command) {
                command.execute();
            });
        };

        CommandTransaction.prototype.revert = function () {
            this.commands.reverse().forEach(function (command) {
                command.revert();
            });
            this.commands.reverse();
        };

        CommandTransaction.prototype.push = function (command) {
            this.commands.push(command);
        };
        return CommandTransaction;
    })();

    var Grid = (function () {
        function Grid() {
            this.nodes_ = [];
            this.links_ = [];
            this.undoStack = [];
            this.redoStack = [];
        }
        Grid.prototype.appendNode = function (node) {
            var _this = this;
            this.execute({
                execute: function () {
                    node.index = _this.nodes_.length;
                    _this.nodes_.push(node);
                    _this.updateConnections();
                },
                revert: function () {
                    node.index = undefined;
                    _this.nodes_.pop();
                    _this.updateConnections();
                }
            });
        };

        Grid.prototype.appendLink = function (sourceIndex, targetIndex) {
            var _this = this;
            var sourceNode = this.nodes_[sourceIndex];
            var targetNode = this.nodes_[targetIndex];
            var link = new Link(sourceNode, targetNode);
            this.execute({
                execute: function () {
                    _this.links_.push(link);
                    _this.updateLinkIndex();
                    _this.updateConnections();
                },
                revert: function () {
                    _this.links_.pop();
                    _this.updateLinkIndex();
                    _this.updateConnections();
                }
            });
        };

        Grid.prototype.removeNode = function (removeNodeIndex) {
            var _this = this;
            var removeNode = this.nodes_[removeNodeIndex];
            var removedLinks;
            var previousLinks;
            this.execute({
                execute: function () {
                    _this.nodes_.splice(removeNodeIndex, 1);
                    previousLinks = _this.links_;
                    _this.links_ = _this.links_.filter(function (link) {
                        return link.source != removeNode && link.target != removeNode;
                    });
                    _this.updateNodeIndex();
                    _this.updateConnections();
                },
                revert: function () {
                    _this.nodes_.splice(removeNodeIndex, 0, removeNode);
                    _this.links_ = previousLinks;
                    _this.updateNodeIndex();
                    _this.updateConnections();
                }
            });
        };

        Grid.prototype.updateNodeText = function (nodeIndex, newText) {
            var node = this.nodes_[nodeIndex];
            var oldText = node.text;
            this.execute({
                execute: function () {
                    node.text = newText;
                },
                revert: function () {
                    node.text = oldText;
                }
            });
        };

        Grid.prototype.updateLinkWeight = function (linkIndex, newWeight) {
            var link = this.links_[linkIndex];
            var oldWeight = link.weight;
            this.execute({
                execute: function () {
                    link.weight = newWeight;
                },
                revert: function () {
                    link.weight = oldWeight;
                }
            });
        };

        Grid.prototype.incrementLinkWeight = function (linkIndex) {
            this.updateLinkWeight(linkIndex, this.links_[linkIndex].weight + 1);
        };

        Grid.prototype.decrementLinkWeight = function (linkIndex) {
            this.updateLinkWeight(linkIndex, this.links_[linkIndex].weight - 1);
        };

        Grid.prototype.mergeNode = function (fromIndex, toIndex) {
            var _this = this;
            var fromNode = this.nodes_[fromIndex];
            var toNode = this.nodes_[toIndex];
            var newLinks = this.links_.filter(function (link) {
                return (link.source == fromNode && !_this.hasPath(toNode.index, link.target.index)) || (link.target == fromNode && !_this.hasPath(link.source.index, toNode.index));
            }).map(function (link) {
                if (link.source == fromNode) {
                    return new Link(toNode, link.target);
                } else {
                    return new Link(link.source, toNode);
                }
            });
            this.transactionWith(function () {
                _this.updateNodeText(toIndex, toNode.text + ", " + fromNode.text);
                _this.removeNode(fromIndex);
                _this.execute({
                    execute: function () {
                        newLinks.forEach(function (link) {
                            _this.links_.push(link);
                        });
                        _this.updateConnections();
                    },
                    revert: function () {
                        for (var i = 0; i < newLinks.length; ++i) {
                            _this.links_.pop();
                        }
                        _this.updateConnections();
                    }
                });
            });
        };

        Grid.prototype.radderUpAppend = function (fromIndex, newNode) {
            var _this = this;
            this.transactionWith(function () {
                _this.appendNode(newNode);
                _this.radderUp(fromIndex, newNode.index);
            });
        };

        Grid.prototype.radderUp = function (fromIndex, toIndex) {
            this.appendLink(toIndex, fromIndex);
        };

        Grid.prototype.radderDownAppend = function (fromIndex, newNode) {
            var _this = this;
            this.transactionWith(function () {
                _this.appendNode(newNode);
                _this.radderDown(fromIndex, newNode.index);
            });
        };

        Grid.prototype.radderDown = function (fromIndex, toIndex) {
            this.appendLink(fromIndex, toIndex);
        };

        Grid.prototype.canUndo = function () {
            return this.undoStack.length > 0;
        };

        Grid.prototype.undo = function () {
            var commands = this.undoStack.pop();
            commands.revert();
            this.redoStack.push(commands);
        };

        Grid.prototype.canRedo = function () {
            return this.redoStack.length > 0;
        };

        Grid.prototype.redo = function () {
            var commands = this.redoStack.pop();
            commands.execute();
            this.undoStack.push(commands);
        };

        Grid.prototype.toJSON = function () {
            return "";
        };

        Grid.prototype.nodes = function (arg) {
            if (arg === undefined) {
                return this.nodes_;
            }
            this.nodes_ = arg;
            this.updateNodeIndex();
            this.updateConnections();
            return this;
        };

        Grid.prototype.links = function (arg) {
            if (arg === undefined) {
                return this.links_;
            }
            this.links_ = arg;
            this.updateLinkIndex();
            this.updateConnections();
            return this;
        };

        Grid.prototype.link = function (index1, index2) {
            if (typeof index2 === "undefined") { index2 = undefined; }
            if (index2 === undefined) {
                return this.links_[index1];
            } else {
                return this.links_.reduce(function (p, link) {
                    if (link.source.index == index1 && link.target.index == index2) {
                        return link;
                    } else {
                        return p;
                    }
                }, undefined);
            }
        };

        Grid.prototype.layout = function () {
            dagre.layout().nodes(this.nodes_).edges(this.links_).rankSep(200).edgeSep(20).run();

            this.nodes_.forEach(function (node) {
                node.x = node.dagre.y;
                node.y = node.dagre.x;
            });

            this.links_.forEach(function (link) {
                link.dagre.points.forEach(function (point) {
                    var tmp = point.x;
                    point.x = point.y;
                    point.y = tmp;
                });
                link.previousPoints = link.points;
                link.points = link.dagre.points.map(function (p) {
                    return p;
                });
                link.points.unshift(link.source.right());
                link.points.push(link.target.left());
            });
        };

        Grid.prototype.hasPath = function (fromIndex, toIndex) {
            return this.pathMatrix[fromIndex][toIndex];
        };

        Grid.prototype.hasLink = function (fromIndex, toIndex) {
            return this.linkMatrix[fromIndex][toIndex];
        };

        Grid.prototype.execute = function (command) {
            var _this = this;
            if (this.transaction) {
                command.execute();
                this.transaction.push(command);
            } else {
                this.transactionWith(function () {
                    _this.execute(command);
                });
            }
        };

        Grid.prototype.transactionWith = function (f) {
            this.beginTransaction();
            f();
            this.commitTransaction();
        };

        Grid.prototype.beginTransaction = function () {
            this.transaction = new CommandTransaction();
        };

        Grid.prototype.commitTransaction = function () {
            this.undoStack.push(this.transaction);
            this.redoStack = [];
            this.transaction = undefined;
        };

        Grid.prototype.rollbackTransaction = function () {
            this.transaction.revert();
            this.transaction = undefined;
        };

        Grid.prototype.updateConnections = function () {
            var _this = this;
            this.linkMatrix = this.nodes_.map(function (_) {
                return _this.nodes_.map(function (_) {
                    return false;
                });
            });
            this.links_.forEach(function (link) {
                _this.linkMatrix[link.source.index][link.target.index] = true;
            });
            this.pathMatrix = this.nodes_.map(function (_, fromIndex) {
                return _this.nodes_.map(function (_, toIndex) {
                    var checkedFlags = _this.nodes_.map(function (_) {
                        return false;
                    });
                    var front = [fromIndex];
                    while (front.length > 0) {
                        var nodeIndex = front.pop();
                        if (nodeIndex == toIndex) {
                            return true;
                        }
                        if (!checkedFlags[nodeIndex]) {
                            _this.nodes_.forEach(function (_, j) {
                                if (_this.linkMatrix[nodeIndex][j]) {
                                    front.push(j);
                                }
                            });
                        }
                    }
                    return false;
                });
            });
        };

        Grid.prototype.updateNodeIndex = function () {
            this.nodes_.forEach(function (node, i) {
                node.index = i;
            });
        };

        Grid.prototype.updateLinkIndex = function () {
            this.links_.forEach(function (link, i) {
                link.index = i;
            });
        };

        Grid.prototype.updateIndex = function () {
            this.updateNodeIndex();
            this.updateLinkIndex();
        };
        return Grid;
    })();
    Egm.Grid = Grid;
})(Egm || (Egm = {}));
var Egm;
(function (Egm) {
    (function (Raddering) {
        Raddering[Raddering["RadderUp"] = 0] = "RadderUp";

        Raddering[Raddering["RadderDown"] = 1] = "RadderDown";
    })(Egm.Raddering || (Egm.Raddering = {}));
    var Raddering = Egm.Raddering;

    var EgmUi = (function () {
        function EgmUi() {
            this.grid_ = new Egm.Grid();
        }
        EgmUi.prototype.nodes = function (arg) {
            if (arg === undefined) {
                return this.grid_.nodes();
            }
            this.grid_.nodes(arg);

            return this;
        };

        EgmUi.prototype.links = function (arg) {
            if (arg === undefined) {
                return this.grid_.links();
            }
            this.grid_.links(arg);
            return this;
        };

        EgmUi.prototype.draw = function () {
            var _this = this;
            var spline = d3.svg.line().x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            }).interpolate("basis");

            var nodes = this.grid_.nodes();
            var links = this.grid_.links();

            var nodesSelection = this.contentsSelection.select(".nodes").selectAll(".element").data(nodes, Object);
            nodesSelection.exit().remove();
            nodesSelection.enter().append("g").classed("new", true).call(this.appendElement());

            nodesSelection.each(function (node) {
                var rect = _this.calcRect(node.text);
                node.width = rect.width;
                node.height = rect.height;
            });
            nodesSelection.selectAll("text").text(function (d) {
                return d.text;
            }).attr("x", function (d) {
                return EgmUi.rx - d.width / 2;
            }).attr("y", function (d) {
                return EgmUi.rx;
            });
            nodesSelection.selectAll("rect").attr("x", function (d) {
                return -d.width / 2;
            }).attr("y", function (d) {
                return -d.height / 2;
            }).attr("width", function (d) {
                return d.width;
            }).attr("height", function (d) {
                return d.height;
            });

            var linksSelection = this.contentsSelection.select(".links").selectAll(".link").data(links, Object);
            linksSelection.exit().remove();
            linksSelection.enter().append("path").classed("link", true).each(function (link) {
                link.points = [link.source.right(), link.target.left()];
            });
            ;

            this.grid_.layout();

            this.rootSelection.selectAll(".contents .links .link").filter(function (link) {
                return link.previousPoints.length != link.points.length;
            }).attr("d", function (link) {
                if (link.points.length > link.previousPoints.length) {
                    while (link.points.length != link.previousPoints.length) {
                        link.previousPoints.unshift(link.previousPoints[0]);
                    }
                } else {
                    link.previousPoints.splice(1, link.previousPoints.length - link.points.length);
                }
                return spline(link.previousPoints);
            });

            var linkWidthScale = d3.scale.linear().domain(d3.extent(this.grid_.links(), function (link) {
                return link.weight;
            })).range([5, 15]);
            var transition = this.rootSelection.transition();
            transition.selectAll(".element").attr("transform", function (node) {
                return (new Svg.Transform.Translate(node.center().x, node.center().y)).toString() + (new Svg.Transform.Rotate(node.theta / Math.PI * 180)).toString();
            });
            transition.selectAll(".link").attr("d", function (link) {
                return spline(link.points);
            }).attr("stroke-width", function (d) {
                return linkWidthScale(d.weight);
            });

            this.resetUndoButton();
            this.resetRedoButton();
            return this;
        };

        EgmUi.prototype.resetUndoButton = function () {
            if (this.grid_.canUndo()) {
                this.enableUndoButton();
            } else {
                this.disableUndoButton();
            }
        };

        EgmUi.prototype.resetRedoButton = function () {
            if (this.grid_.canRedo()) {
                this.enableRedoButton();
            } else {
                this.disableRedoButton();
            }
        };

        EgmUi.prototype.display = function () {
            var _this = this;
            return function (selection) {
                _this.rootSelection = selection;

                selection.append("text").classed("measure", true);

                selection.append("rect").attr("fill", "none").attr("width", "100%").attr("height", "100%");

                _this.contentsSelection = selection.append("g").classed("contents", true);
                _this.contentsSelection.append("g").classed("links", true);
                _this.contentsSelection.append("g").classed("nodes", true);

                _this.contentsZoomBehavior = d3.behavior.zoom().on("zoom", function () {
                    var translate = new Svg.Transform.Translate(d3.event.translate[0], d3.event.translate[1]);
                    var scale = new Svg.Transform.Scale(d3.event.scale);
                    _this.contentsSelection.attr("transform", translate.toString() + scale.toString());
                });
                selection.call(_this.contentsZoomBehavior);
            };
        };

        EgmUi.prototype.createNode = function (text) {
            var node = new Egm.Node();
            node.text = text;

            return node;
        };

        EgmUi.prototype.focusNode = function (node) {
            var translate = new Svg.Transform.Translate($(document).width() / 2 - node.x, $(document).height() / 2 - node.y);
            var scale = new Svg.Transform.Scale(this.contentsZoomBehavior.scale());
            this.contentsZoomBehavior.translate([translate.x, translate.y]);
            this.contentsSelection.transition().attr("transform", translate.toString() + scale.toString());
        };

        EgmUi.prototype.appendNodeButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.on("click", function () {
                    var name = prompt("追加する要素の名前を入力してください");
                    if (name) {
                        var node = egm.createNode(name);
                        egm.grid_.appendNode(node);
                        egm.draw();
                        var addedElement = egm.contentsSelection.select(".element.new");
                        egm.rootSelection.selectAll(".element.new").classed("new", false);
                        egm.selectElement(addedElement);
                        egm.focusNode(addedElement.datum());
                    }
                });
                return this;
            };
            return f;
        };

        EgmUi.prototype.removeNodeButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.on("click", function () {
                    var node = egm.rootSelection.select(".selected").datum();
                    egm.unselectElement();
                    egm.grid_.removeNode(node.index);
                    egm.draw();
                });
                return this;
            };
            f.onEnable = function (f) {
                egm.onEnableRemoveNodeButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egm.onDisableRemoveNodeButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.mergeNodeButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.call(egm.dragNode().isDroppable(function (fromNode, toNode) {
                    return !egm.grid_.hasPath(toNode.index, fromNode.index);
                }).dragToNode(function (fromNode, toNode) {
                    egm.grid_.mergeNode(fromNode.index, toNode.index);

                    egm.draw();
                    egm.unselectElement();
                    egm.focusNode(toNode);
                }));
                return this;
            };
            f.onEnable = function (f) {
                egm.onEnableMergeNodeButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egm.onDisableMergeNodeButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.radderUpButton = function () {
            var _this = this;
            var grid = this;
            var f = function (selection) {
                _this.raddering(selection, Raddering.RadderUp);
            };
            f.onEnable = function (f) {
                grid.onEnableRadderUpButton = f;
                return this;
            };
            f.onDisable = function (f) {
                grid.onDisableRadderUpButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.radderDownButton = function () {
            var grid = this;
            var f = function (selection) {
                grid.raddering(selection, Raddering.RadderDown);
                return this;
            };
            f.onEnable = function (f) {
                grid.onEnableRadderDownButton = f;
                return this;
            };
            f.onDisable = function (f) {
                grid.onDisableRadderDownButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.save = function () {
            if (this.onClickSaveButton) {
                this.onClickSaveButton(JSON.stringify(this.grid_));
            }
        };

        EgmUi.prototype.saveButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.on("click", function () {
                    egm.save();
                });
                return this;
            };
            f.save = function (f) {
                egm.onClickSaveButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.undo = function () {
            this.grid_.undo();
            this.draw();
        };

        EgmUi.prototype.undoButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.on("click", function () {
                    egm.undo();
                });
                this.resetUndoButton;
                return this;
            };
            f.onEnable = function (f) {
                egm.onEnableUndoButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egm.onDisableUndoButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.redo = function () {
            this.grid_.redo();
            this.draw();
        };

        EgmUi.prototype.redoButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.on("click", function () {
                    egm.redo();
                });
                this.resetRedoButton;
                return this;
            };
            f.onEnable = function (f) {
                egm.onEnableRedoButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egm.onDisableRedoButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.getTextBBox = function (text) {
            return this.rootSelection.select(".measure").text(text).node().getBBox();
        };

        EgmUi.prototype.calcRect = function (text) {
            var bbox = this.getTextBBox(text);
            return new Svg.Rect(bbox.x, bbox.y, bbox.width + EgmUi.rx * 2, bbox.height + EgmUi.rx * 2);
        };

        EgmUi.prototype.appendElement = function () {
            var _this = this;
            return function (selection) {
                var self = _this;
                var onElementClick = function () {
                    var selection = d3.select(this);
                    if (selection.classed("selected")) {
                        self.unselectElement();
                        d3.event.stopPropagation();
                    } else {
                        self.selectElement(selection);
                        d3.event.stopPropagation();
                    }
                };
                selection.classed("element", true).on("click", onElementClick).on("touchstart", onElementClick);

                selection.append("rect").attr("rx", EgmUi.rx);
                selection.append("text");
            };
        };

        EgmUi.prototype.selectElement = function (selection) {
            this.rootSelection.selectAll(".selected").classed("selected", false);
            selection.classed("selected", true);
            this.enableNodeButtons();
            this.drawNodeConnection();
        };

        EgmUi.prototype.drawNodeConnection = function () {
            var _this = this;
            var d = this.rootSelection.select(".selected").datum();
            this.rootSelection.selectAll(".connected").classed("connected", false);
            if (d) {
                d3.selectAll(".element").filter(function (d2) {
                    return _this.grid_.hasPath(d.index, d2.index) || _this.grid_.hasPath(d2.index, d.index);
                }).classed("connected", true);
                d3.selectAll(".link").filter(function (link) {
                    return (_this.grid_.hasPath(d.index, link.source.index) && _this.grid_.hasPath(d.index, link.target.index)) || (_this.grid_.hasPath(link.source.index, d.index) && _this.grid_.hasPath(link.target.index, d.index));
                }).classed("connected", true);
            }
        };

        EgmUi.prototype.enableNodeButtons = function () {
            var selection = d3.select(".selected");
            this.enableRemoveNodeButton(selection);
            this.enableMergeNodeButton(selection);
            this.enableRadderUpButton(selection);
            this.enableRadderDownButton(selection);
        };

        EgmUi.prototype.unselectElement = function () {
            this.rootSelection.selectAll(".selected").classed("selected", false);
            this.rootSelection.selectAll(".connected").classed("connected", false);
            this.disableRemoveNodeButton();
            this.disableMergeNodeButton();
            this.disableRadderUpButton();
            this.disableRadderDownButton();
        };

        EgmUi.prototype.enableRadderUpButton = function (selection) {
            if (this.onEnableRadderUpButton) {
                this.onEnableRadderUpButton(selection);
            }
        };

        EgmUi.prototype.disableRadderUpButton = function () {
            if (this.onDisableRadderUpButton) {
                this.onDisableRadderUpButton();
            }
        };

        EgmUi.prototype.enableRadderDownButton = function (selection) {
            if (this.onEnableRadderDownButton) {
                this.onEnableRadderDownButton(selection);
            }
        };

        EgmUi.prototype.disableRadderDownButton = function () {
            if (this.onDisableRadderDownButton) {
                this.onDisableRadderDownButton();
            }
        };

        EgmUi.prototype.enableRemoveNodeButton = function (selection) {
            if (this.onEnableRemoveNodeButton) {
                this.onEnableRemoveNodeButton(selection);
            }
        };

        EgmUi.prototype.disableRemoveNodeButton = function () {
            if (this.onDisableRemoveNodeButton) {
                this.onDisableRemoveNodeButton();
            }
        };

        EgmUi.prototype.enableMergeNodeButton = function (selection) {
            if (this.onEnableMergeNodeButton) {
                this.onEnableMergeNodeButton(selection);
            }
        };

        EgmUi.prototype.disableMergeNodeButton = function () {
            if (this.onDisableMergeNodeButton) {
                this.onDisableMergeNodeButton();
            }
        };

        EgmUi.prototype.enableUndoButton = function () {
            if (this.onEnableUndoButton) {
                this.onEnableUndoButton();
            }
        };

        EgmUi.prototype.disableUndoButton = function () {
            if (this.onDisableUndoButton) {
                this.onDisableUndoButton();
            }
        };

        EgmUi.prototype.enableRedoButton = function () {
            if (this.onEnableRedoButton) {
                this.onEnableRedoButton();
            }
        };

        EgmUi.prototype.disableRedoButton = function () {
            if (this.onDisableRedoButton) {
                this.onDisableRedoButton();
            }
        };

        EgmUi.prototype.dragNode = function () {
            var egm = this;
            var isDroppable_;
            var dragToNode_;
            var dragToOther_;
            var f = function (selection) {
                var from;
                selection.call(d3.behavior.drag().on("dragstart", function () {
                    from = d3.select(".selected");
                    from.classed("dragSource", true);
                    var pos = d3.mouse(egm.rootSelection.select(".contents").node());
                    egm.rootSelection.select(".contents").append("line").classed("dragLine", true).attr("x1", pos[0]).attr("y1", pos[1]).attr("x2", pos[0]).attr("y2", pos[1]);
                    d3.event.sourceEvent.stopPropagation();
                }).on("drag", function () {
                    var dragLineSelection = egm.rootSelection.select(".dragLine");
                    var x1 = Number(dragLineSelection.attr("x1"));
                    var y1 = Number(dragLineSelection.attr("y1"));
                    var x2 = d3.event.x;
                    var y2 = d3.event.y;
                    var theta = Math.atan2(y2 - y1, x2 - x1);
                    var r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) - 10;
                    dragLineSelection.attr("x2", x1 + r * Math.cos(theta)).attr("y2", y1 + r * Math.sin(theta));
                    var pos = egm.getPos();
                    var to = d3.select(document.elementFromPoint(pos.x, pos.y).parentNode);
                    var fromNode = from.datum();
                    var toNode = to.datum();
                    if (to.classed("element") && !to.classed("selected")) {
                        if (isDroppable_ && isDroppable_(fromNode, toNode)) {
                            to.classed("droppable", true);
                        } else {
                            to.classed("undroppable", true);
                        }
                    } else {
                        egm.rootSelection.selectAll(".droppable, .undroppable").classed("droppable", false).classed("undroppable", false);
                    }
                }).on("dragend", function () {
                    var pos = egm.getPos();
                    var to = d3.select(document.elementFromPoint(pos.x, pos.y).parentNode);
                    var fromNode = from.datum();
                    var toNode = to.datum();
                    if (toNode && fromNode != toNode) {
                        if (dragToNode_ && (!isDroppable_ || isDroppable_(fromNode, toNode))) {
                            dragToNode_(fromNode, toNode);
                        }
                    } else {
                        if (dragToOther_) {
                            dragToOther_(fromNode);
                        }
                    }
                    to.classed("droppable", false);
                    to.classed("undroppable", false);
                    from.classed("dragSource", false);
                    egm.rootSelection.selectAll(".dragLine").remove();
                }));
                return this;
            };
            f.isDroppable_ = function (from, to) {
                return true;
            };
            f.isDroppable = function (f) {
                isDroppable_ = f;
                return this;
            };
            f.dragToNode = function (f) {
                dragToNode_ = f;
                return this;
            };
            f.dragToOther = function (f) {
                dragToOther_ = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.raddering = function (selection, type) {
            var _this = this;
            selection.call(this.dragNode().isDroppable(function (fromNode, toNode) {
                return !((type == Raddering.RadderUp && _this.grid_.hasPath(fromNode.index, toNode.index)) || (type == Raddering.RadderDown && _this.grid_.hasPath(toNode.index, fromNode.index)));
            }).dragToNode(function (fromNode, toNode) {
                switch (type) {
                    case Raddering.RadderUp:
                        if (_this.grid_.hasLink(toNode.index, fromNode.index)) {
                            var link = _this.grid_.link(toNode.index, fromNode.index);
                            _this.grid_.incrementLinkWeight(link.index);
                            _this.draw();
                        } else {
                            _this.grid_.radderUp(fromNode.index, toNode.index);
                            _this.draw();
                            _this.drawNodeConnection();
                            _this.enableNodeButtons();
                            _this.focusNode(toNode);
                        }
                        break;
                    case Raddering.RadderDown:
                        if (_this.grid_.hasLink(fromNode.index, toNode.index)) {
                            var link = _this.grid_.link(fromNode.index, toNode.index);
                            _this.grid_.incrementLinkWeight(link.index);
                            _this.draw();
                        } else {
                            _this.grid_.radderDown(fromNode.index, toNode.index);
                            _this.draw();
                            _this.drawNodeConnection();
                            _this.enableNodeButtons();
                            _this.focusNode(toNode);
                        }
                        break;
                }
            }).dragToOther(function (fromNode) {
                var text = prompt("追加する要素の名前を入力してください");
                if (text) {
                    var node = _this.createNode(text);
                    switch (type) {
                        case Raddering.RadderUp:
                            _this.grid_.radderUpAppend(fromNode.index, node);
                            break;
                        case Raddering.RadderDown:
                            _this.grid_.radderDownAppend(fromNode.index, node);
                            break;
                    }
                    _this.draw();
                    _this.drawNodeConnection();
                    _this.enableNodeButtons();
                    _this.focusNode(node);
                }
            }));
        };

        EgmUi.prototype.getPos = function () {
            var xy = d3.event.sourceEvent instanceof MouseEvent ? d3.mouse(document.body) : d3.touches(document.body, d3.event.sourceEvent.changedTouches)[0];
            return new Svg.Point(xy[0], xy[1]);
        };
        EgmUi.rx = 20;
        return EgmUi;
    })();
    Egm.EgmUi = EgmUi;
})(Egm || (Egm = {}));
angular.module('collaboegm', []).config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when("/projects", {
            templateUrl: "/partials/project-list.html",
            controller: ProjectListController
        }).when("/projects/:projectId", {
            templateUrl: "/partials/project-detail.html",
            controller: ProjectDetailController
        }).when("/participants/:projectId/:participantId/edit", {
            templateUrl: "/partials/egm-edit.html",
            controller: EgmEditController
        }).when("/participants/:projectId/:participantId", {
            templateUrl: "/partials/participant-detail.html",
            controller: ParticipantDetailController
        }).otherwise({
            redirectTo: "/projects"
        });
    }
]);

function ProjectListController($scope, $http, $templateCache) {
    $http.get("/api/projects").success(function (data) {
        $scope.projects = data;
    });
    $scope.newProject = {};
    $scope.createProject = function () {
        $http({
            method: 'PUT',
            url: '/api/projects',
            data: $scope.newProject
        }).success(function (data, status, headers, config) {
            $scope.projects.push(data);
            $scope.newProject = {};
        });
    };
}

function ProjectDetailController($scope, $routeParams, $http) {
    var projectId = $routeParams.projectId;
    $scope.projectId = projectId;
    $http.get("/api/projects/" + projectId).success(function (data) {
        $scope.project = data;
    });
    $http.get("/api/participants/" + projectId).success(function (data) {
        $scope.participants = data;
    });
    $scope.newParticipant = {};
    $scope.createParticipant = function () {
        $http({
            method: 'PUT',
            url: '/api/participants/' + projectId,
            data: $scope.newParticipant
        }).success(function (data) {
            $scope.participants.push(data);
            $scope.newParticipant = {};
        });
    };
}

function ParticipantDetailController($scope, $routeParams, $http) {
    var projectId = $scope.projectId = $routeParams.projectId;
    var participantId = $scope.participantId = $routeParams.participantId;
    $http.get("/api/participants/" + projectId + "/" + participantId).success(function (data) {
        $scope.participant = data;
    });
}

function EgmEditController($scope, $routeParams, $http) {
    var egm = new Egm.EgmUi();
    d3.select("#display").call(egm.display());
    d3.select("#appendNodeButton").call(egm.appendNodeButton());
    d3.select("#undoButton").call(egm.undoButton().onEnable(function () {
        d3.select("#undoButton").node().disabled = false;
    }).onDisable(function () {
        d3.select("#undoButton").node().disabled = true;
    }));
    d3.select("#redoButton").call(egm.redoButton().onEnable(function () {
        d3.select("#redoButton").node().disabled = false;
    }).onDisable(function () {
        d3.select("#redoButton").node().disabled = true;
    }));
    d3.select("#saveButton").call(egm.saveButton().save(function (jsonString) {
    }));

    d3.select("#display .contents").append("circle").classed("invisible", true).attr("id", "radderUpButton").attr("r", 15).call(egm.radderUpButton().onEnable(function (selection) {
        var node = selection.datum();
        d3.select("#radderUpButton").classed("invisible", false).attr("transform", new Svg.Transform.Translate(node.left().x, node.left().y));
    }).onDisable(function () {
        d3.select("#radderUpButton").classed("invisible", true);
    }));
    d3.select("#display .contents").append("circle").classed("invisible", true).attr("id", "radderDownButton").attr("r", 15).call(egm.radderDownButton().onEnable(function (selection) {
        var node = selection.datum();
        d3.select("#radderDownButton").classed("invisible", false).attr("transform", new Svg.Transform.Translate(node.right().x, node.right().y));
    }).onDisable(function () {
        d3.select("#radderDownButton").classed("invisible", true);
    }));
    d3.select("#display .contents").append("circle").classed("invisible", true).attr("id", "removeNodeButton").attr("r", 15).call(egm.removeNodeButton().onEnable(function (selection) {
        var node = selection.datum();
        d3.select("#removeNodeButton").classed("invisible", false).attr("transform", new Svg.Transform.Translate(node.bottom().x, node.bottom().y));
    }).onDisable(function () {
        d3.select("#removeNodeButton").classed("invisible", true);
    }));
    d3.select("#display .contents").append("circle").classed("invisible", true).attr("id", "mergeNodeButton").attr("r", 15).call(egm.mergeNodeButton().onEnable(function (selection) {
        var node = selection.datum();
        d3.select("#mergeNodeButton").classed("invisible", false).attr("transform", new Svg.Transform.Translate(node.top().x, node.top().y));
    }).onDisable(function () {
        d3.select("#mergeNodeButton").classed("invisible", true);
    }));

    var projectId = $scope.projectId = $routeParams.projectId;
    var participantId = $scope.participantId = $routeParams.participantId;
    var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";
    $http.get(jsonUrl).success(function (data) {
        egm.nodes(data.nodes).links(data.links).draw();
    });
}

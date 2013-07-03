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
            return new Point(this.height / 2 * Math.sin(this.theta) + this.x, this.height / 2 * Math.cos(this.theta) + this.y);
        };

        Rect.prototype.bottom = function () {
            return new Point(this.height / 2 * Math.sin(this.theta) + this.x, this.height / 2 * Math.cos(this.theta) + this.y);
        };

        Rect.prototype.center = function () {
            return new Point(this.x, this.y);
        };
        return Rect;
    })();
    Svg.Rect = Rect;
})(Svg || (Svg = {}));
var Egm;
(function (Egm) {
    var Vertex = (function () {
        function Vertex(item) {
            this.text = item.text;
            this.children = [];
        }
        Vertex.prototype.hasChild = function (node) {
            return this.children.indexOf(node) >= 0;
        };

        Vertex.prototype.appendChild = function (node) {
            this.children.push(node);
        };

        Vertex.prototype.removeChild = function (node) {
            this.children = this.children.filter(function (child) {
                return child != node;
            });
        };
        return Vertex;
    })();
    Egm.Vertex = Vertex;

    var Edge = (function () {
        function Edge(source, target) {
            this.source = source;
            this.target = target;
        }
        return Edge;
    })();
    Egm.Edge = Edge;

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
        function Grid(data) {
        }
        Grid.prototype.appendNode = function (item) {
            var _this = this;
            var node = new Vertex(item);
            node.index = this.nodes.length;
            this.execute({
                execute: function () {
                    _this.nodes.push(node);
                    _this.connections.push(_this.connections.map(function () {
                        return false;
                    }));
                    _this.connections.forEach(function (row) {
                        row.push(false);
                    });
                },
                revert: function () {
                    _this.nodes.pop();
                    _this.connections.pop();
                    _this.connections.forEach(function (row) {
                        row.pop();
                    });
                }
            });
        };

        Grid.prototype.appendLink = function (link) {
            var _this = this;
            this.execute({
                execute: function () {
                    _this.links.push(link);
                    _this.updateConnections();
                },
                revert: function () {
                    _this.links.pop();
                    _this.updateConnections();
                }
            });
        };

        Grid.prototype.appendChild = function (node, child) {
            var _this = this;
            this.execute({
                execute: function () {
                    node.children.push(child);
                    _this.updateConnections();
                },
                revert: function () {
                    node.children.pop();
                    _this.updateConnections();
                }
            });
        };

        Grid.prototype.removeNode = function (removeNode) {
            var _this = this;
            var parentNodes = this.nodes.filter(function (node) {
                return node.hasChild(removeNode);
            });
            var previousLinks;
            this.execute({
                execute: function () {
                    _this.nodes.splice(removeNode.index, 1);
                    parentNodes.forEach(function (node) {
                        node.removeChild(removeNode);
                    });
                    previousLinks = _this.links;
                    _this.links = _this.links.filter(function (link) {
                        return link.source != removeNode && link.target != removeNode;
                    });
                    _this.updateConnections();
                },
                revert: function () {
                    _this.nodes.splice(removeNode.index, 0, removeNode);
                    _this.updateIndex();
                    parentNodes.forEach(function (node) {
                        node.appendChild(removeNode);
                    });
                    _this.links = previousLinks;
                    _this.updateConnections();
                }
            });
        };

        Grid.prototype.radderUp = function (from, to) {
        };

        Grid.prototype.radderDown = function (from, to) {
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

        Grid.prototype.hasConnection = function (from, to) {
            return this.connections[from.index][to.index];
        };

        Grid.prototype.hasPath = function (from, to) {
            var checkedFlags = this.nodes.map(function (_) {
                return false;
            });
            var front = [from];
            while (front.length > 0) {
                var node = front.pop();
                if (node == to) {
                    return true;
                }
                if (!checkedFlags[node.index]) {
                    node.children.forEach(function (child) {
                        if (!checkedFlags[child.index]) {
                            front.push(child);
                        }
                    });
                }
            }
            return false;
        };

        Grid.prototype.execute = function (command) {
            if (this.transaction) {
                command.execute();
                this.transaction.push(command);
            } else {
                this.transactionWith(function () {
                    command.execute();
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
            this.transaction = undefined;
        };

        Grid.prototype.rollbackTransaction = function () {
            this.transaction.revert();
            this.transaction = undefined;
        };

        Grid.prototype.updateConnections = function () {
            var _this = this;
            this.connections = this.nodes.map(function (_, i) {
                return _this.nodes.map(function (_, j) {
                    return _this.hasPath(_this.nodes[i], _this.nodes[j]);
                });
            });
        };

        Grid.prototype.updateIndex = function () {
            this.nodes.forEach(function (node, i) {
                node.index = i;
            });
        };
        return Grid;
    })();
    Egm.Grid = Grid;
})(Egm || (Egm = {}));
var grid;

var Egm;
(function (Egm) {
    function initEgm(selection) {
        selection.append("text").attr("id", "measure");

        selection.append("rect").attr("fill", "none").attr("width", "100%").attr("height", "100%");

        var contents = selection.append("g").attr("id", "contents");
        contents.append("g").attr("id", "links");
        contents.append("g").attr("id", "elements");

        var radderUpButton = contents.append("g").attr("id", "radderUpButton").classed("radderButton", true).classed("invisible", true).call(radderUp);
        radderUpButton.append("rect");
        radderUpButton.append("text").text("ラダーアップ");

        var radderDownButton = contents.append("g").attr("id", "radderDownButton").classed("radderButton", true).classed("invisible", true).call(radderDown);
        radderDownButton.append("rect");
        radderDownButton.append("text").text("ラダーダウン");

        var removeElementButton = contents.append("g").attr("id", "removeElementButton").classed("radderButton", true).classed("invisible", true).call(initRemoveElementButton);
        removeElementButton.append("rect");
        removeElementButton.append("text").text("削除");

        d3.selectAll(".radderButton").each(function () {
            var rx = 10;
            var bbox = this.lastChild.getBBox();
            var width = bbox.width + 2 * rx;
            var height = bbox.height + 2 * rx;
            d3.select(this.firstChild).attr("x", -width / 2).attr("y", -height / 2).attr("rx", rx).attr("width", width).attr("height", height);
            d3.select(this.lastChild).attr("x", rx - width / 2).attr("y", height / 2 - rx);
        });

        var contentsZoomBehavior = d3.behavior.zoom().on("zoom", function () {
            var translate = new Svg.Transform.Translate(d3.event.translate[0], d3.event.translate[1]);
            var scale = new Scale(d3.event.scale);
            contents.attr("transform", translate + scale);
        });
        selection.call(contentsZoomBehavior);
    }
    Egm.initEgm = initEgm;

    function initRemoveElementButton(selection) {
        selection.on("click", function () {
            grid.transactionWith(function () {
                grid.removeNode(d3.select(".selected").datum());
            });
            draw(grid);
            unselectElement();
        });
    }

    function raddering(selection, isRadderUp) {
        var from;
        selection.call(d3.behavior.drag().on("dragstart", function () {
            from = d3.select(".selected");
            from.classed("dragSource", true);
            var pos = d3.mouse(d3.select("#contents").node());
            d3.select("#contents").append("line").classed("dragLine", true).attr("x1", pos[0]).attr("y1", pos[1]).attr("x2", pos[0]).attr("y2", pos[1]);
            d3.event.sourceEvent.stopPropagation();
        }).on("drag", function () {
            var x1 = Number(d3.select(".dragLine").attr("x1"));
            var y1 = Number(d3.select(".dragLine").attr("y1"));
            var x2 = d3.event.x;
            var y2 = d3.event.y;
            var theta = Math.atan2(y2 - y1, x2 - x1);
            var r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) - 10;
            d3.select(".dragLine").attr("x2", x1 + r * Math.cos(theta)).attr("y2", y1 + r * Math.sin(theta));
            var pos = getPos();
            var to = d3.select(document.elementFromPoint(pos[0], pos[1]).parentNode);
            if (to.classed("element") && !to.classed("selected")) {
                if ((isRadderUp && grid.hasConnection(from.datum(), to.datum())) || (!isRadderUp && grid.hasConnection(to.datum(), from.datum()))) {
                    to.classed("undroppable", true);
                } else {
                    to.classed("droppable", true);
                }
            } else {
                d3.selectAll(".droppable, .undroppable").classed("droppable", false).classed("undroppable", false);
            }
        }).on("dragend", function () {
            var pos = getPos();
            var to = d3.select(document.elementFromPoint(pos[0], pos[1]).parentNode);
            if (to.datum() && from.datum() != to.datum()) {
                if (isRadderUp) {
                    if (!grid.hasConnection(from.datum(), to.datum()) && !grid.hasLink(to.datum(), from.datum())) {
                        grid.radderUp(from.datum(), to.datum());
                        draw(grid);
                        selectElement(from.node());
                    }
                } else {
                    if (!grid.hasConnection(to.datum(), from.datum()) && !grid.hasLink(from.datum(), to.datum())) {
                        grid.radderDown(from.datum(), to.datum());
                        draw(grid);
                        selectElement(from.node());
                    }
                }
            } else {
                var text = prompt("追加する要素の名前を入力してください");
                if (text) {
                    var bbox = d3.select("#measure").text(text).node().getBBox();
                    grid.transactionWith(function () {
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
        }));
    }

    function radderUp(selection) {
        raddering(selection, true);
    }

    function radderDown(selection) {
        raddering(selection, false);
    }

    function getPos() {
        return d3.event.sourceEvent instanceof MouseEvent ? d3.mouse(document.body) : d3.touches(document.body, d3.event.sourceEvent.changedTouches)[0];
    }

    function appendElement(selection) {
        var rx = 20;

        var onElementClick = function () {
            if (d3.select(this).classed("selected")) {
                unselectElement();
                d3.event.stopPropagation();
            } else {
                selectElement(this);
                d3.event.stopPropagation();
            }
        };
        selection.classed("element", true).on("click", onElementClick).on("touchstart", onElementClick);

        var rect = selection.append("rect");
        selection.append("text").text(function (d) {
            return d.text;
        }).attr("x", function (d) {
            return rx - d.rect.width / 2;
        }).attr("y", function (d) {
            return rx;
        });
        rect.attr("x", function (d) {
            return -d.rect.width / 2;
        }).attr("y", function (d) {
            return -d.rect.height / 2;
        }).attr("rx", rx).attr("width", function (d) {
            return d.rect.width;
        }).attr("height", function (d) {
            return d.rect.height;
        });
    }

    function draw(data) {
        var keyFunction = function (obj) {
            return obj.key;
        };
        var spline = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("basis");

        d3.selectAll("#contents #elements .element").data(data.nodes, keyFunction).exit().remove();
        d3.selectAll("#contents #links .link").data(data.links, keyFunction).exit().remove();

        d3.selectAll("#contents #elements .element.new").classed("new", false);
        d3.select("#contents #elements").selectAll(".element").data(data.nodes, keyFunction).enter().append("g").classed("new", true).attr("transform", function (node) {
            return new Svg.Transform.Translate(node.rect.center().x || 0, node.rect.center().y || 0);
        }).call(appendElement);

        d3.select("#contents #links").selectAll(".link").data(data.links, keyFunction).enter().append("path").classed("link", true);

        data.nodes.forEach(function (node) {
            node.width = node.rect.height;
            node.height = node.rect.width;
        });

        dagre.layout().nodes(data.nodes).edges(data.links).rankSep(200).edgeSep(20).run();

        d3.selectAll("#contents #links .link").attr("d", function (link) {
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
        });
        data.nodes.forEach(function (node) {
            node.rect = new Svg.Rect(node.dagre.y, node.dagre.x, node.rect.width, node.rect.height);
            var tmp = node.dagre.x;
            node.dagre.y = node.dagre.y;
            node.dagre.y = tmp;
        });
        data.links.forEach(function (link) {
            link.dagre.points.forEach(function (point) {
                var tmp = point.x;
                point.x = point.y;
                point.y = tmp;
            });
            link.points = link.dagre.points.map(function (p) {
                return p;
            });
            link.points.unshift(link.source.rect.right());
            link.points.push(link.target.rect.left());
        });

        var transition = d3.select("#contents").transition();
        transition.selectAll(".element").attr("transform", function (node) {
            var hoge = Svg.Transform.Translate;
            return (new Svg.Transform.Translate(node.rect.center().x, node.rect.center().y)).toString() + (new Svg.Transform.Rotate(node.rect.theta / Math.PI * 180)).toString();
        });

        transition.selectAll(".link").attr("d", function (link) {
            return spline(link.points);
        });

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
        d3.select("#radderUpButton").attr("transform", new Svg.Transform.Translate(d.rect.left().x - 100, d.rect.left().y));
        d3.select("#radderDownButton").attr("transform", new Svg.Transform.Translate(d.rect.right().x + 100, d.rect.right().y));
        d3.select("#removeElementButton").attr("transform", new Svg.Transform.Translate(d.rect.bottom().x, d.rect.bottom().y + 30));

        d3.selectAll(".radderButton.invisible").classed("invisible", false);

        d3.selectAll(".element").filter(function (d2) {
            return grid.hasConnection(d, d2) || grid.hasConnection(d2, d);
        }).classed("connected", true);
        d3.selectAll(".link").filter(function (link) {
            return (grid.hasConnection(d, link.source) && grid.hasConnection(d, link.target)) || (grid.hasConnection(link.source, d) && grid.hasConnection(link.target, d));
        }).classed("connected", true);
    }

    function unselectElement() {
        d3.selectAll(".selected").classed("selected", false);
        d3.selectAll(".radderButton").classed("invisible", true);
        d3.selectAll(".connected").classed("connected", false);
    }
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
    var projectId = $routeParams.projectId;
    var participantId = $routeParams.participantId;
    $http.get("/api/participants/" + projectId + "/" + participantId).success(function (data) {
        $scope.participant = data;
    });
}

function EgmEditController($scope, $routeParams, $http) {
    d3.select("#display").call(Egm.initEgm);

    var projectId = $scope.projectId = $routeParams.projectId;
    var participantId = $scope.participantId = $routeParams.participantId;
    $http.get("/api/participants/" + projectId + "/" + participantId).success(function (data) {
        console.log(data);
    });
}

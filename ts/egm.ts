/// <reference path="ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="svg.ts"/>
/// <reference path="grid.ts"/>

module Egm {
  export enum ViewMode {
    Normal,
    Edge
  }


  export enum InactiveNode {
    Hidden,
    Transparent
  }


  export class EgmOption {
    public viewMode : ViewMode;
    public inactiveNode : InactiveNode;
    public scalingConnection : boolean;

    static default() : EgmOption {
      var option = new EgmOption;
      option.viewMode = ViewMode.Normal;
      option.inactiveNode = InactiveNode.Transparent;
      option.scalingConnection = true;
      return option;
    }
  }


  export interface AppendNodeButton {
    (selection : D3.Selection) : AppendNodeButton;
    onClick(f : (callback : (result : string) => void) => void) : AppendNodeButton;
  }


  export interface RemoveNodeButton {
    (selection : D3.Selection) : RemoveNodeButton;
    onEnable(f : (selection : D3.Selection) => void) : RemoveNodeButton;
    onDisable(f : () => void) : RemoveNodeButton;
  }


  export interface MergeNodeButton {
    (selection : D3.Selection) : MergeNodeButton;
    onEnable(f : (selection : D3.Selection) => void) : MergeNodeButton;
    onDisable(f : () => void) : MergeNodeButton;
  }


  export interface RadderUpButton {
    (selection : D3.Selection) : RadderUpButton;
    onClick(f : (callback : (result : string) => void) => void) : RadderUpButton;
    onEnable(f : (selection : D3.Selection) => void) : RadderUpButton;
    onDisable(f : () => void) : RadderUpButton;
  }


  export interface RadderDownButton {
    (selection : D3.Selection) : RadderDownButton;
    onClick(f : (callback : (result : string) => void) => void) : RadderDownButton;
    onEnable(f : (selection : D3.Selection) => void) : RadderDownButton;
    onDisable(f : () => void) : RadderDownButton;
  }


  export interface UndoButton {
    (selection : D3.Selection) : UndoButton;
    onEnable(f : () => void) : UndoButton;
    onDisable(f : () => void) : UndoButton;
  }


  export interface RedoButton {
    (selection : D3.Selection) : RedoButton;
    onEnable(f : () => void) : RedoButton;
    onDisable(f : () => void) : RedoButton;
  }


  export interface SaveButton {
    (selection : D3.Selection) : SaveButton;
    save(f : (jsonString : string) => void) : SaveButton;
  }


  interface DragNode {
    (selection : D3.Selection) : DragNode;
    isDroppable(f : (from : Node, to : Node) => boolean) : DragNode;
    dragToNode(f : (from : Node, to : Node) => void) : DragNode;
    dragToOther(f : (from : Node) => void) : DragNode;
  }


  interface ConnectNodeBehavior {
    (selection : D3.Selection) : ConnectNodeBehavior;
  }


  export enum Raddering {
    RadderUp,
    RadderDown
  }


  export class EgmUi {
    private static rx : number = 20;
    private grid_ : Grid;
    private options_ : EgmOption;
    private displayWidth : number;
    private displayHeight : number;
    private rootSelection : D3.Selection;
    private contentsSelection : D3.Selection;
    private contentsZoomBehavior : D3.Behavior.Zoom;
    private onEnableRemoveNodeButton : (selection : D3.Selection) => void;
    private onDisableRemoveNodeButton : () => void;
    private onEnableMergeNodeButton : (selection : D3.Selection) => void;
    private onDisableMergeNodeButton : () => void;
    private onEnableRadderUpButton : (selection : D3.Selection) => void;
    private onDisableRadderUpButton : () => void;
    private onEnableRadderDownButton : (selection : D3.Selection) => void;
    private onDisableRadderDownButton : () => void;
    private onEnableUndoButton : () => void;
    private onDisableUndoButton : () => void;
    private onEnableRedoButton : () => void;
    private onDisableRedoButton : () => void;
    private onClickSaveButton : (json : Object) => void;
    private openAppendNodePrompt : (callback : (result : string) => void) => void;
    private openLadderUpPrompt : (callback : (result : string) => void) => void;
    private openLadderDownPrompt : (callback : (result : string) => void) => void;


    constructor () {
      this.grid_ = new Grid;
      this.options_ = EgmOption.default();
    }


    nodes() : Node[];
    nodes(nodes : Node[]) : EgmUi;
    nodes(arg? : Node[]) : any {
      if (arg === undefined) {
        return this.grid_.nodes();
      }
      this.grid_.nodes(arg);
      return this;
    }


    links() : Link[];
    links(links : Link[]) : EgmUi;
    links(arg? : Link[]) : any {
      if (arg === undefined) {
        return this.grid_.links();
      }
      this.grid_.links(arg);
      return this;
    }


    options() : EgmOption;
    options(options : EgmOption) : EgmUi;
    options(arg? : EgmOption) : any {
      if (arg === undefined) {
        return this.options_;
      }
      this.options_ = arg;
      return this;
    }


    draw(f = undefined) : EgmUi {
      var spline = d3.svg.line()
        .x(d => d.x)
        .y(d => d.y)
        .interpolate("basis")
        ;

      var nodes = this.grid_.nodes();
      var links = this.grid_.links();
      if (this.options_.inactiveNode == InactiveNode.Hidden) {
        nodes = nodes.filter(d => d.active);
        links = links.filter(d => d.source.active && d.target.active);
      }

      var nodesSelection = this.contentsSelection
        .select(".nodes")
        .selectAll(".element")
        .data(nodes, Object)
        ;
      nodesSelection.exit().remove();
      nodesSelection
        .enter()
        .append("g")
        .call(this.appendElement())
        ;

      var nodeSizeScale = d3.scale
          .linear()
          .domain(d3.extent(this.grid_.nodes(), node => {
            return this.grid_.numConnectedNodes(node.index, true);
          }))
          .range([1, this.options_.scalingConnection ? 3 : 1])
          ;
      nodesSelection.each(node => {
        var rect = this.calcRect(node.text);
        var n = this.grid_.numConnectedNodes(node.index, true);
        node.baseWidth = rect.width;
        node.baseHeight = rect.height;
        node.width = node.baseWidth * nodeSizeScale(n);
        node.height = node.baseHeight * nodeSizeScale(n);
      });
      nodesSelection.selectAll("text")
        .text(d => d.text)
        .attr("x", d => EgmUi.rx - d.baseWidth / 2)
        .attr("y", d => EgmUi.rx)
        ;
      nodesSelection.selectAll("rect")
        .attr("x", d => - d.baseWidth / 2)
        .attr("y", d => - d.baseHeight / 2)
        .attr("rx", d => (d.original || d.isTop || d.isBottom) ? 0 : EgmUi.rx)
        .attr("width", d => d.baseWidth)
        .attr("height", d => d.baseHeight)
        ;

      var linksSelection = this.contentsSelection
        .select(".links")
        .selectAll(".link")
        .data(links, Object)
        ;
      linksSelection.exit().remove();
      linksSelection
        .enter()
        .append("path")
        .classed("link", true)
        .each(link => {
          link.points = [link.source.right(), link.target.left()];
        });
        ;

      this.grid_.layout(this.options_.inactiveNode == InactiveNode.Hidden);

      this.rootSelection.selectAll(".contents .links .link")
        .filter(link => link.previousPoints.length != link.points.length)
        .attr("d", (link : Link) : string => {
          if (link.points.length > link.previousPoints.length) {
            while (link.points.length != link.previousPoints.length) {
              link.previousPoints.unshift(link.previousPoints[0]);
            }
          } else {
            link.previousPoints.splice(1, link.previousPoints.length - link.points.length);
          }
          return spline(link.previousPoints);
        })
        ;

      var linkWidthScale = d3.scale
        .linear()
        .domain(d3.extent(this.grid_.links(), (link) => {
          return link.weight;
        }))
        .range([5, 15])
        ;
      var transition = this.rootSelection.transition();
      transition.selectAll(".element")
        .attr("opacity", node => {
          return node.active ? 1 : 0.3;
        })
        .attr("transform", (node : Egm.Node) : string => {
          return (new Svg.Transform.Translate(node.center().x, node.center().y)).toString()
            + (new Svg.Transform.Rotate(node.theta / Math.PI * 180)).toString()
            + (new Svg.Transform.Scale(nodeSizeScale(this.grid_.numConnectedNodes(node.index, true)))).toString();
        })
        ;
      transition.selectAll(".link")
        .attr("d", (link : Egm.Link) : string => {
          return spline(link.points);
        })
        .attr("opacity", link => {
          return link.source.active && link.target.active ? 1 : 0.3;
        })
        .attr("stroke-width", d => linkWidthScale(d.weight))
        ;
      transition.each("end", f);


      var filterdNodes = this.options_.inactiveNode == InactiveNode.Hidden
        ? this.grid_.nodes().filter(node => node.active)
        : this.grid_.nodes()
      var left = d3.min(filterdNodes, node => {
        return node.left().x;
      });
      var right = d3.max(filterdNodes, node => {
        return node.right().x;
      });
      var top = d3.min(filterdNodes, node => {
        return node.top().y;
      });
      var bottom = d3.max(filterdNodes, node => {
        return node.bottom().y;
      });

      var s = 0.9 * d3.min([
          this.displayWidth / (right - left),
          this.displayHeight / (bottom - top)]) || 1;
      this.contentsZoomBehavior
        .scaleExtent([s, 1])
        ;

      this.resetUndoButton();
      this.resetRedoButton();
      return this;
    }


    private resetUndoButton() : void {
      if (this.grid_.canUndo()) {
        this.enableUndoButton();
      } else {
        this.disableUndoButton();
      }
    }


    private resetRedoButton() : void {
      if (this.grid_.canRedo()) {
        this.enableRedoButton();
      } else {
        this.disableRedoButton();
      }
    }


    display(regionWidth : number = undefined, regionHeight : number = undefined)
        : (selection : D3.Selection) => void {
      return (selection) => {
        this.rootSelection = selection;

        this.displayWidth = regionWidth || $(window).width();
        this.displayHeight = regionHeight || $(window).height();
        selection.attr("viewBox", (new Svg.ViewBox(0, 0, this.displayWidth, this.displayHeight)).toString());
        selection.append("text")
          .classed("measure", true)
          ;

        selection.append("rect")
          .attr("fill", "#fff")
          .attr("width", this.displayWidth)
          .attr("height", this.displayHeight)
          ;

        this.contentsSelection = selection.append("g").classed("contents", true);
        this.contentsSelection.append("g").classed("links", true);
        this.contentsSelection.append("g").classed("nodes", true);

        this.contentsZoomBehavior = d3.behavior.zoom()
          .on("zoom", () => {
              var translate = new Svg.Transform.Translate(
                d3.event.translate[0], d3.event.translate[1]);
              var scale = new Svg.Transform.Scale(d3.event.scale);
              this.contentsSelection.attr(
                "transform", translate.toString() + scale.toString());

              this.enableRemoveNodeButton(d3.select(".selected"));
          })
          ;
        selection.call(this.contentsZoomBehavior);
      };
    }


    private createNode(text : string) : Node {
      var node = new Egm.Node(text);
      return node;
    }


    private focusNode(node : Node) : void {
      var s = this.contentsZoomBehavior.scale() || 1;
      var translate = new Svg.Transform.Translate(
        this.displayWidth / 2 - node.center().x * s,
        this.displayHeight / 2 - node.center().y * s
         );
      var scale = new Svg.Transform.Scale(s);
      this.contentsZoomBehavior.translate([translate.x, translate.y]);
      this.contentsSelection
        .transition()
        .attr("transform", translate.toString() + scale.toString());
    }


    focusCenter() : void {
      var left = d3.min(this.grid_.nodes(), node => {
        return node.left().x;
      });
      var right = d3.max(this.grid_.nodes(), node => {
        return node.right().x;
      });
      var top = d3.min(this.grid_.nodes(), node => {
        return node.top().y;
      });
      var bottom = d3.max(this.grid_.nodes(), node => {
        return node.bottom().y;
      });

      var s = 0.9 * d3.min([
          this.displayWidth / (right - left),
          this.displayHeight / (bottom - top)]) || 1;
      var translate = new Svg.Transform.Translate(
          (this.displayWidth - (right - left) * s) / 2,
          (this.displayHeight - (bottom - top) * s) / 2
          );
      var scale = new Svg.Transform.Scale(s);
      this.contentsZoomBehavior.translate([translate.x, translate.y]);
      this.contentsZoomBehavior.scale(scale.sx);
      this.contentsSelection
        .transition()
        .attr("transform", translate.toString() + scale.toString());
    }


    appendNodeButton() : AppendNodeButton {
      var egm = this;
      var onClickPrompt;
      var f : any = function(selection : D3.Selection) : AppendNodeButton {
        selection.on("click", () => {
          onClickPrompt && onClickPrompt((text : string) : void => {
            if (text) {
            var node;
              if (node = egm.grid_.findNode(text)) {
                // node already exists
              } else {
                // create new node
                node = egm.createNode(text);
                node.original = true;
                egm.grid_.appendNode(node);
                egm.disableNodeButtons();
                egm.draw(() => {
                  egm.enableNodeButtons();
                });
              }
              var addedElement = egm.contentsSelection
                  .selectAll(".element")
                  .filter(node => node.text == text);
              egm.selectElement(addedElement);
              egm.focusNode(addedElement.datum());
            }
          });
        });
        return this;
      };
      f.onClick = function(f : (callback : (result : string) => void) => void) : AppendNodeButton {
        onClickPrompt = f;
        return this;
      }
      return f;
    }


    removeNodeButton() : RemoveNodeButton {
      var egm = this;
      var f : any = function(selection : D3.Selection) : RemoveNodeButton {
        selection.on("click", () => {
          var node = egm.rootSelection.select(".selected").datum();
          egm.unselectElement();
          egm.grid_.removeNode(node.index);
          egm.draw();
        });
        return this;
      };
      f.onEnable = function(f : (selection : D3.Selection) => void) : RemoveNodeButton {
        egm.onEnableRemoveNodeButton = f;
        return this;
      };
      f.onDisable = function(f : () => void) : RemoveNodeButton {
        egm.onDisableRemoveNodeButton = f;
        return this;
      };
      return f;
    }


    mergeNodeButton() : MergeNodeButton {
      var egm = this;
      var f : any = function(selection : D3.Selection) : MergeNodeButton {
        selection.call(egm.dragNode()
            .isDroppable((fromNode : Node, toNode : Node) : boolean => {
              return !egm.grid_.hasPath(toNode.index, fromNode.index)
            })
            .dragToNode((fromNode : Node, toNode : Node) : void => {
              egm.grid_.mergeNode(fromNode.index, toNode.index);
              egm.draw();
              egm.unselectElement();
              egm.focusNode(toNode);
            }));
        return this;
      }
      f.onEnable = function(f : (selection : D3.Selection) => void) : MergeNodeButton {
        egm.onEnableMergeNodeButton = f;
        return this;
      };
      f.onDisable = function(f : () => void) : MergeNodeButton {
        egm.onDisableMergeNodeButton = f;
        return this;
      };
      return f;
    }


    radderUpButton() : RadderUpButton {
      var grid = this;
      var f : any = (selection : D3.Selection) : void => {
        this.raddering(selection, Raddering.RadderUp);
      }
      f.onClick = function(f : (callback : (result : string) => void) => void) : RadderUpButton {
        grid.openLadderUpPrompt = f;
        return this;
      };
      f.onEnable = function(f : (selection : D3.Selection) => void) : RadderUpButton {
        grid.onEnableRadderUpButton = f;
        return this;
      };
      f.onDisable = function(f : () => void) : RadderUpButton {
        grid.onDisableRadderUpButton = f;
        return this;
      };
      return f;
    }


    radderDownButton() : RadderDownButton {
      var grid = this;
      var f : any = function(selection : D3.Selection) : RadderDownButton {
        grid.raddering(selection, Raddering.RadderDown);
        return this;
      }
      f.onClick = function(f : (callback : (result : string) => void) => void) : RadderDownButton {
        grid.openLadderDownPrompt = f;
        return this;
      };
      f.onEnable = function(f : (selection : D3.Selection) => void) : RadderDownButton {
        grid.onEnableRadderDownButton = f;
        return this;
      }
      f.onDisable = function(f : () => void) : RadderDownButton {
        grid.onDisableRadderDownButton = f;
        return this;
      }
      return f;
    }


    private save() : void {
      if (this.onClickSaveButton) {
        this.onClickSaveButton(this.grid_.toJSON());
      }
    }


    saveButton() : SaveButton {
      var egm = this;
      var f : any = function(selection : D3.Selection) : SaveButton {
        selection.on("click", () => {
          egm.save();
        });
        return this;
      }
      f.save = function(f : (jsonString : string) => void) : SaveButton {
        egm.onClickSaveButton = f;
        return this;
      }
      return f;
    }


    private undo() : void {
      this.grid_.undo();
      this.draw();
      this.disableNodeButtons();
    }


    undoButton() : UndoButton {
      var egm = this;
      var f : any = function(selection : D3.Selection) : UndoButton {
        selection.on("click", () => {
          egm.undo();
        });
        egm.resetUndoButton();
        return this;
      }
      f.onEnable = function(f : () => void) : UndoButton {
        egm.onEnableUndoButton = f;
        return this;
      }
      f.onDisable = function(f : () => void) : UndoButton {
        egm.onDisableUndoButton = f;
        return this;
      }
      return f;
    }


    private redo() : void {
      this.grid_.redo();
      this.draw();
      this.disableNodeButtons();
    }


    redoButton() : RedoButton {
      var egm = this;
      var f : any = function(selection : D3.Selection) : RedoButton {
        selection.on("click", () => {
          egm.redo();
        });
        egm.resetRedoButton();
        return this;
      }
      f.onEnable = function(f : () => void) : RedoButton {
        egm.onEnableRedoButton = f;
        return this;
      }
      f.onDisable = function(f : () => void) : RedoButton {
        egm.onDisableRedoButton = f;
        return this;
      }
      return f;
    }


    private getTextBBox(text : string) : SVGRect {
      return this.rootSelection.select(".measure").text(text).node().getBBox();
    }


    private calcRect(text : string) : Svg.Rect {
      var bbox = this.getTextBBox(text);
      return new Svg.Rect(
          bbox.x,
          bbox.y,
          bbox.width + EgmUi.rx * 2,
          bbox.height + EgmUi.rx * 2);
    }


    private appendElement() : (selection : D3.Selection) => void {
      return (selection) => {
        var self = this;
        var onElementClick = function() {
          var selection = d3.select(this);
          if (selection.classed("selected")) {
            self.unselectElement();
            d3.event.stopPropagation();
          } else {
            self.selectElement(selection);
            d3.event.stopPropagation();
          }
        };
        selection
          .classed("element", true)
          .on("click", onElementClick)
          .on("touchstart", onElementClick)
          ;

        selection.append("rect");
        selection.append("text");
      }
    }


    private selectElement(selection : D3.Selection) : void {
      this.rootSelection.selectAll(".selected").classed("selected", false);
      selection.classed("selected", true);
      this.enableNodeButtons();
      this.drawNodeConnection();
    }


    public selectedNode() : Node {
      var selection = this.rootSelection.select(".selected");
      return selection.empty() ? null : selection.datum();
    }


    private drawNodeConnection() : void {
      var d = this.selectedNode();
      this.rootSelection.selectAll(".connected").classed("connected", false);
      if (d) {
        d3.selectAll(".element")
          .filter((d2 : Node) : boolean => {
            return this.grid_.hasPath(d.index, d2.index) || this.grid_.hasPath(d2.index, d.index);
          })
          .classed("connected", true)
          ;
        d3.selectAll(".link")
          .filter((link : Link) : boolean => {
            return (this.grid_.hasPath(d.index, link.source.index)
                && this.grid_.hasPath(d.index, link.target.index))
              || (this.grid_.hasPath(link.source.index, d.index)
                && this.grid_.hasPath(link.target.index, d.index));
          })
          .classed("connected", true)
          ;
      }
    }


    private enableNodeButtons() {
      var selection = d3.select(".selected");
      this.enableRemoveNodeButton(selection);
      this.enableMergeNodeButton(selection);
      this.enableRadderUpButton(selection);
      this.enableRadderDownButton(selection);
    }


    private disableNodeButtons() {
      this.disableRemoveNodeButton();
      this.disableMergeNodeButton();
      this.disableRadderUpButton();
      this.disableRadderDownButton();
    }


    private unselectElement() {
      this.rootSelection.selectAll(".selected").classed("selected", false);
      this.rootSelection.selectAll(".connected").classed("connected", false);
      this.disableNodeButtons();
    }


    private enableRadderUpButton(selection : D3.Selection) : void {
      if (this.onEnableRadderUpButton) {
        this.onEnableRadderUpButton(selection);
      }
    }


    private disableRadderUpButton() : void {
      if (this.onDisableRadderUpButton) {
        this.onDisableRadderUpButton();
      }
    }


    private enableRadderDownButton(selection : D3.Selection) : void {
      if (this.onEnableRadderDownButton) {
        this.onEnableRadderDownButton(selection);
      }
    }


    private disableRadderDownButton() : void {
      if (this.onDisableRadderDownButton) {
        this.onDisableRadderDownButton();
      }
    }


    private enableRemoveNodeButton(selection : D3.Selection) : void {
      if (this.onEnableRemoveNodeButton) {
        this.onEnableRemoveNodeButton(selection);
      }
    }


    private disableRemoveNodeButton() : void {
      if (this.onDisableRemoveNodeButton) {
        this.onDisableRemoveNodeButton();
      }
    }


    private enableMergeNodeButton(selection : D3.Selection) : void {
      if (this.onEnableMergeNodeButton) {
        this.onEnableMergeNodeButton(selection);
      }
    }


    private disableMergeNodeButton() : void {
      if (this.onDisableMergeNodeButton) {
        this.onDisableMergeNodeButton();
      }
    }


    private enableUndoButton() : void {
      if (this.onEnableUndoButton) {
        this.onEnableUndoButton();
      }
    }


    private disableUndoButton() : void {
      if (this.onDisableUndoButton) {
        this.onDisableUndoButton();
      }
    }


    private enableRedoButton() : void {
      if (this.onEnableRedoButton) {
        this.onEnableRedoButton();
      }
    }


    private disableRedoButton() : void {
      if (this.onDisableRedoButton) {
        this.onDisableRedoButton();
      }
    }


    private dragNode() : DragNode {
      var egm = this;
      var isDroppable_;
      var dragToNode_;
      var dragToOther_;
      var f : any = function(selection : D3.Selection) : DragNode {
        var from;
        selection.call(d3.behavior.drag()
            .on("dragstart", () => {
              from = d3.select(".selected");
              from.classed("dragSource", true);
              var pos = [from.datum().center().x, from.datum().center().y];
              egm.rootSelection.select(".contents")
                .append("line")
                .classed("dragLine", true)
                .attr("x1", pos[0])
                .attr("y1", pos[1])
                .attr("x2", pos[0])
                .attr("y2", pos[1])
                ;
              d3.event.sourceEvent.stopPropagation();
            })
            .on("drag", () => {
              var dragLineSelection = egm.rootSelection.select(".dragLine");
              var x1 = Number(dragLineSelection.attr("x1"));
              var y1 = Number(dragLineSelection.attr("y1"));
              var p2 = egm.getPos(egm.rootSelection.select(".contents").node());
              var x2 = p2.x;
              var y2 = p2.y;
              var theta = Math.atan2(y2 - y1, x2 - x1);
              var r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) - 10;
              dragLineSelection
                .attr("x2", x1 + r * Math.cos(theta))
                .attr("y2", y1 + r * Math.sin(theta))
                ;
              var pos = egm.getPos(document.body);
              var to = d3.select(document.elementFromPoint(pos.x, pos.y).parentNode);
              var fromNode : Node = from.datum();
              var toNode : Node = to.datum();
              if (to.classed("element") && !to.classed("selected")) {
                if (isDroppable_ && isDroppable_(fromNode, toNode)) {
                  to.classed("droppable", true);
                } else {
                  to.classed("undroppable", true);
                }
              } else {
                egm.rootSelection.selectAll(".droppable, .undroppable")
                  .classed("droppable", false)
                  .classed("undroppable", false)
                  ;
              }
            })
            .on("dragend", () => {
              var pos = egm.getPos(document.body);
              var to = d3.select(document.elementFromPoint(pos.x, pos.y).parentNode);
              var fromNode : Node = from.datum();
              var toNode : Node = to.datum();
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
            }))
            ;
        return this;
      }
      f.isDroppable_ = (from : Node, to : Node) : boolean => true;
      f.isDroppable = function(f : (from : Node, to : Node) => boolean) : DragNode {
        isDroppable_ = f;
        return this;
      }
      f.dragToNode = function(f : (from : Node, to : Node) => void) : DragNode {
        dragToNode_ = f;
        return this;
      }
      f.dragToOther = function(f : (from : Node) => void) : DragNode {
        dragToOther_ = f;
        return this;
      }
      return f;
    }


    private raddering(selection : D3.Selection, type : Raddering) : void {
      var dragToNode = (fromNode : Node, toNode : Node) : void => {
        switch (type) {
        case Raddering.RadderUp:
          if (this.grid_.hasLink(toNode.index, fromNode.index)) {
            var link = this.grid_.link(toNode.index, fromNode.index);
            this.grid_.incrementLinkWeight(link.index);
            this.draw();
          } else {
            this.grid_.radderUp(fromNode.index, toNode.index);
            this.draw(() => {
              this.enableNodeButtons();
            });
            this.drawNodeConnection();
            this.focusNode(toNode);
            this.disableNodeButtons();
          }
          break;
        case Raddering.RadderDown:
          if (this.grid_.hasLink(fromNode.index, toNode.index)) {
            var link = this.grid_.link(fromNode.index, toNode.index);
            this.grid_.incrementLinkWeight(link.index);
            this.draw();
          } else {
            this.grid_.radderDown(fromNode.index, toNode.index);
            this.draw(() => {
              this.enableNodeButtons();
            });
            this.drawNodeConnection();
            this.focusNode(toNode);
            this.disableNodeButtons();
          }
          break;
        }
      };

      selection.call(this.dragNode()
          .isDroppable((fromNode : Node, toNode : Node) : boolean => {
            return !((type == Raddering.RadderUp && this.grid_.hasPath(fromNode.index, toNode.index))
              || (type == Raddering.RadderDown && this.grid_.hasPath(toNode.index, fromNode.index)))
          })
          .dragToNode(dragToNode)
          .dragToOther((fromNode : Node) : void => {
            var openPrompt;
            switch (type) {
            case Raddering.RadderUp:
              openPrompt = this.openLadderUpPrompt;
              break;
            case Raddering.RadderDown:
              openPrompt = this.openLadderDownPrompt;
              break;
            }

            openPrompt && openPrompt(text => {
              if (text) {
                var node;
                if (node = this.grid_.findNode(text)) {
                  dragToNode(fromNode, node);
                } else {
                  node = this.createNode(text);
                  switch (type) {
                  case Raddering.RadderUp:
                    this.grid_.radderUpAppend(fromNode.index, node);
                    break;
                  case Raddering.RadderDown:
                    this.grid_.radderDownAppend(fromNode.index, node);
                    break;
                  }
                  this.draw(() => {
                    this.enableNodeButtons();
                  });
                  this.drawNodeConnection();
                  this.focusNode(node);
                }
              }
            })
          }));
    }


    private getPos(container) : Svg.Point {
      var xy = d3.event.sourceEvent instanceof MouseEvent
        ? d3.mouse(container)
        : d3.touches(container, d3.event.sourceEvent.changedTouches)[0];
      return new Svg.Point(xy[0], xy[1]);
    }
  }
}

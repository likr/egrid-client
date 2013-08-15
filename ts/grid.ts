/// <reference path="libs/dagre/dagre.d.ts"/>
/// <reference path="svg.ts"/>

module Egm {
  export class Node {
    public index : number;
    public x : number;
    public y : number;
    public baseWidth : number;
    public baseHeight : number;
    public width : number;
    public height : number;
    public theta : number;
    public text : string;
    public dagre : any;
    public weight : number;
    public key : number;
    public original : boolean;
    public isTop : boolean;
    public isBottom : boolean;
    private static nextKey = 0;


    constructor(text : string, weight : number = undefined) {
      this.text = text;
      this.x = 0;
      this.y = 0;
      this.theta = 0;
      this.weight = weight || 1;
      this.key = Node.nextKey++;
    }


    left() : Svg.Point {
      return Svg.Rect.left(this.x, this.y, this.width, this.height);
    }


    right() : Svg.Point {
      return Svg.Rect.right(this.x, this.y, this.width, this.height);
    }


    top() : Svg.Point {
      return Svg.Rect.top(this.x, this.y, this.width, this.height);
    }


    bottom() : Svg.Point {
      return Svg.Rect.bottom(this.x, this.y, this.width, this.height);
    }


    center() : Svg.Point {
      return Svg.Rect.center(this.x, this.y, this.width, this.height);
    }


    toString() : string {
      return this.key.toString();
    }
  }


  export class Link {
    public index : number;
    public points : Svg.Point[];
    public previousPoints : Svg.Point[];
    public dagre : any;
    public weight : number;
    public key : number;
    private static nextKey = 0;


    constructor(public source : Node, public target : Node, weight : number = undefined) {
      this.weight = weight || 1;
      this.key = Link.nextKey++;
    }


    toString() : string {
      return this.key.toString();
    }
  }


  interface Command {
    execute : () => void;
    revert : () => void;
  }


  class CommandTransaction {
    private commands : Command[] = [];


    execute() : void {
      this.commands.forEach((command) => {
        command.execute();
      });
    }


    revert() : void {
      this.commands.reverse().forEach(command => {
        command.revert();
      });
      this.commands.reverse();
    }


    push(command : Command) : void {
      this.commands.push(command);
    }
  }


  export class Grid {
    private nodes_ : Node[];
    private links_ : Link[];
    private linkMatrix : bool[][];
    private pathMatrix : bool[][];
    private undoStack : CommandTransaction[];
    private redoStack : CommandTransaction[];
    private transaction : CommandTransaction;


    constructor() {
      this.nodes_ = [];
      this.links_ = [];
      this.undoStack = [];
      this.redoStack = [];
    }


    appendNode(node : Node) : void {
      this.execute({
        execute : () => {
          node.index = this.nodes_.length;
          this.nodes_.push(node);
          this.updateConnections();
        },
        revert : () => {
          node.index = undefined;
          this.nodes_.pop();
          this.updateConnections();
        }
      });
    }


    appendLink(sourceIndex : number, targetIndex : number) : void {
      var sourceNode = this.nodes_[sourceIndex];
      var targetNode = this.nodes_[targetIndex];
      var link = new Link(sourceNode, targetNode);
      this.execute({
        execute : () => {
          this.links_.push(link);
          this.updateLinkIndex();
          this.updateConnections();
        },
        revert : () => {
          this.links_.pop();
          this.updateLinkIndex();
          this.updateConnections();
        }
      });
    }


    removeNode(removeNodeIndex : number) : void {
      var removeNode = this.nodes_[removeNodeIndex];
      var removedLinks;
      var previousLinks;
      this.execute({
        execute : () => {
          this.nodes_.splice(removeNodeIndex, 1);
          previousLinks = this.links_;
          this.links_ = this.links_.filter(link => {
            return link.source != removeNode && link.target != removeNode;
          });
          this.updateNodeIndex();
          this.updateConnections();
        },
        revert : () => {
          this.nodes_.splice(removeNodeIndex, 0, removeNode);
          this.links_ = previousLinks;
          this.updateNodeIndex();
          this.updateConnections();
        }
      });
    }


    updateNodeText(nodeIndex : number, newText : string) : void {
      var node = this.nodes_[nodeIndex];
      var oldText = node.text;
      this.execute({
        execute : () => {
          node.text = newText;
        },
        revert : () => {
          node.text = oldText;
        }
      });
    }


    updateLinkWeight(linkIndex : number, newWeight : number) : void {
      var link = this.links_[linkIndex];
      var oldWeight = link.weight;
      this.execute({
        execute : () => {
          link.weight = newWeight;
        },
        revert : () => {
          link.weight = oldWeight;
        }
      });
    }


    incrementLinkWeight(linkIndex : number) : void {
      this.updateLinkWeight(linkIndex, this.links_[linkIndex].weight + 1);
    }


    decrementLinkWeight(linkIndex : number) : void {
      this.updateLinkWeight(linkIndex, this.links_[linkIndex].weight - 1);
    }


    mergeNode(fromIndex : number, toIndex : number) : void {
      var fromNode = this.nodes_[fromIndex];
      var toNode = this.nodes_[toIndex];
      var newLinks = this.links_
        .filter(link => {
          return (link.source == fromNode && !this.hasPath(toNode.index, link.target.index))
          || (link.target == fromNode && !this.hasPath(link.source.index, toNode.index));
        })
        .map(link => {
          if (link.source == fromNode) {
            return new Link(toNode, link.target);
          } else {
            return new Link(link.source, toNode);
          }
        });
      this.transactionWith(() => {
        this.updateNodeText(toIndex, toNode.text + ", " + fromNode.text);
        this.removeNode(fromIndex);
        this.execute({
          execute : () => {
            newLinks.forEach(link => {
              this.links_.push(link);
            });
            this.updateConnections();
          },
          revert : () => {
            for(var i = 0; i < newLinks.length; ++i) {
              this.links_.pop();
            }
            this.updateConnections();
          }
        });
      });
    }


    radderUpAppend(fromIndex : number, newNode : Node) : void {
      this.transactionWith(() => {
        this.appendNode(newNode);
        this.radderUp(fromIndex, newNode.index);
      });
    }


    radderUp(fromIndex : number, toIndex : number) : void {
      this.appendLink(toIndex, fromIndex);
    }


    radderDownAppend(fromIndex : number, newNode : Node) : void {
      this.transactionWith(() => {
        this.appendNode(newNode);
        this.radderDown(fromIndex, newNode.index);
      });
    }


    radderDown(fromIndex : number, toIndex : number) : void {
      this.appendLink(fromIndex, toIndex);
    }


    canUndo() : boolean {
      return this.undoStack.length > 0;
    }


    undo() : void {
      var commands = this.undoStack.pop();
      commands.revert();
      this.redoStack.push(commands);
    }


    canRedo() : boolean {
      return this.redoStack.length > 0;
    }


    redo() : void {
      var commands = this.redoStack.pop();
      commands.execute();
      this.undoStack.push(commands);
    }


    toJSON() : Object {
      return {
        nodes : this.nodes_.map(node => {
          return {
            text : node.text,
            weight : node.text
          };
        }),
        links : this.links_.map(link => {
          return {
            source : link.source.index,
            target : link.target.index,
            weight : link.weight
          }
        })
      };
    }


    nodes() : Node[];
    nodes(nodes : Node[]) : Grid;
    nodes(arg? : Node[]) : any {
      if (arg === undefined) {
        return this.nodes_;
      }
      this.nodes_ = arg;
      this.updateNodeIndex();
      this.updateConnections();
      return this;
    }


    findNode(text : string) : Node {
      var result = null;
      this.nodes_.forEach(node => {
        if (node.text == text) {
          result = node;
        }
      });
      return result;
    }


    links() : Link[];
    links(links : Link[]) : Grid;
    links(arg? : Link[]) : any {
      if (arg === undefined) {
        return this.links_;
      }
      this.links_ = arg;
      this.updateLinkIndex();
      this.updateConnections();
      return this;
    }


    link(linkIndex : number) : Link;
    link(fromNodeIndex : number, toNodeIndex : number) : Link;
    link(index1 : number, index2 : number=undefined) : Link {
      if (index2 === undefined) {
        return this.links_[index1];
      } else {
        return this.links_.reduce((p, link) => {
          if (link.source.index == index1 && link.target.index == index2) {
            return link;
          } else {
            return p;
          }
        }, undefined);
      }
    }


    layout() : void {
      this.nodes_.forEach(node => {
        var tmp = node.height;
        node.height = node.width;
        node.width = tmp
      });

      dagre.layout()
        .nodes(this.nodes_)
        .edges(this.links_)
        .rankSep(200)
        .edgeSep(20)
        .run()
        ;

      this.nodes_.forEach(node => {
        node.x = node.dagre.y;
        node.y = node.dagre.x;
        node.width = node.dagre.height;
        node.height = node.dagre.width;
      });

      this.links_.forEach(link => {
        link.dagre.points.forEach(point => {
          var tmp = point.x;
          point.x = point.y;
          point.y = tmp;
        });
        link.previousPoints = link.points;
        link.points = link.dagre.points.map(p => p);
        link.points.unshift(link.source.right());
        link.points.push(link.target.left());
      });
    }


    hasPath(fromIndex : number, toIndex : number) : boolean {
      return this.pathMatrix[fromIndex][toIndex];
    }


    hasLink(fromIndex : number, toIndex : number) : boolean {
      return this.linkMatrix[fromIndex][toIndex];
    }


    numConnectedNodes(index : number) : number {
      var result = 0;
      this.nodes_.forEach((_, j) => {
        if (this.pathMatrix[index][j] || this.pathMatrix[j][index]) {
          result += 1;
        }
      })
      return result;
    }


    private execute(command : Command) : void {
      if (this.transaction) {
        command.execute();
        this.transaction.push(command);
      } else {
        this.transactionWith(() => {
          this.execute(command);
        });
      }
    }


    private transactionWith(f : () => void) : void {
      this.beginTransaction();
      f();
      this.commitTransaction();
    }


    private beginTransaction() : void {
      this.transaction = new CommandTransaction();
    }


    private commitTransaction() : void {
      this.undoStack.push(this.transaction);
      this.redoStack = [];
      this.transaction = undefined;
    }


    private rollbackTransaction() : void {
      this.transaction.revert();
      this.transaction = undefined;
    }


    private updateConnections() : void {
      this.linkMatrix = this.nodes_.map(_ => {
        return this.nodes_.map(_ => {
          return false;
        });
      });
      this.links_.forEach(link => {
        this.linkMatrix[link.source.index][link.target.index] = true;
      });
      this.nodes_.forEach(node => {
        node.isTop = node.isBottom = true;
      });
      this.pathMatrix = this.nodes_.map((fromNode, fromIndex) => {
        return this.nodes_.map((toNode, toIndex) => {
          var checkedFlags : boolean[] = this.nodes_.map(_ => false);
          var front : number[] = [fromIndex];
          while (front.length > 0) {
            var nodeIndex = front.pop();
            if (nodeIndex == toIndex) {
              if (nodeIndex != fromIndex) {
                fromNode.isBottom = false;
                toNode.isTop = false;
              }
              return true;
            }
            if (!checkedFlags[nodeIndex]) {
              this.nodes_.forEach((_, j) => {
                if (this.linkMatrix[nodeIndex][j]) {
                  front.push(j);
                }
              });
            }
          }
          return false
        });
      });
    }


    private updateNodeIndex() : void {
      this.nodes_.forEach((node : Node, i : number) => {
        node.index = i;
      });
    }


    private updateLinkIndex() : void {
      this.links_.forEach((link : Link, i : number) => {
        link.index = i;
      });
    }


    private updateIndex() : void {
      this.updateNodeIndex();
      this.updateLinkIndex();
    }
  }
}

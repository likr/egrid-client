/// <reference path="libs/dagre/dagre.d.ts"/>
/// <reference path="svg.ts"/>

module Egm {
  export class Node {
    public index : number;
    public x : number;
    public y : number;
    public width : number;
    public height : number;
    public theta : number;
    public text : string;
    public dagre : any;


    constructor() {
      this.x = 0;
      this.y = 0;
      this.theta = 0;
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
  }


  export class Link {
    public points : Svg.Point[];
    public previousPoints : Svg.Point[];
    public dagre : any;
    constructor(public source : Node, public target : Node) {
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
          this.updateConnections();
        },
        revert : () => {
          this.links_.pop();
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
          this.updateConnections();
        },
        revert : () => {
          this.nodes_.splice(removeNodeIndex, 0, removeNode);
          this.links_ = previousLinks;
          this.updateConnections();
        }
      });
    }


    radderUpAppend(fromIndex : number, newNode : Node) : void {
      this.appendNode(newNode);
      this.radderUp(fromIndex, newNode.index);
    }


    radderUp(fromIndex : number, toIndex : number) : void {
      this.appendLink(toIndex, fromIndex);
    }


    radderDownAppend(fromIndex : number, newNode : Node) : void {
      this.appendNode(newNode);
      this.radderDown(fromIndex, newNode.index);
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


    toJSON() : string {
      return "";
    }


    nodes() : Node[];
    nodes(nodes : Node[]) : Grid;
    nodes(arg? : Node[]) : any {
      if (arg === undefined) {
        return this.nodes_;
      }
      this.nodes_ = arg;
      this.updateConnections();
      return this;
    }


    links() : Link[];
    links(links : Link[]) : Grid;
    links(arg? : Link[]) : any {
      if (arg === undefined) {
        return this.links_;
      }
      this.links_ = arg;
      this.updateConnections();
      return this;
    }


    layout() : void {
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
      this.pathMatrix = this.nodes_.map((_, fromIndex) => {
        return this.nodes_.map((_, toIndex) => {
          var checkedFlags : boolean[] = this.nodes_.map(_ => false);
          var front : number[] = [fromIndex];
          while (front.length > 0) {
            var nodeIndex = front.pop();
            if (nodeIndex == toIndex) {
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
  }
}

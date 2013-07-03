module Egm {
  export interface Item {
    text : string;
  }

  export class Vertex {
    public text : string;
    public index : number;
    public children : Vertex[];

    constructor(item : Item) {
      this.text = item.text;
      this.children = [];
    }

    hasChild(node : Vertex) {
      return this.children.indexOf(node) >= 0;
    }

    appendChild(node : Vertex) {
      this.children.push(node);
    }

    removeChild(node : Vertex) {
      this.children = this.children.filter(child => child != node);
    }
  }

  export class Edge {
    constructor(public source : Vertex, public target : Vertex) {
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
      this.commands.reverse().forEach((command) => {
        command.revert();
      });
      this.commands.reverse();
    }

    push(command : Command) : void {
      this.commands.push(command);
    }
  }

  export class Grid {
    private connections : bool[][];
    private nodes : Vertex[];
    private links : Edge[];
    private undoStack : CommandTransaction[];
    private redoStack : CommandTransaction[];
    private transaction : CommandTransaction;

    constructor(data) {
    }

    appendNode(item : Item) : void {
      var node = new Vertex(item);
      node.index = this.nodes.length;
      this.execute({
        execute : () => {
          this.nodes.push(node);
          this.connections.push(this.connections.map(() => false));
          this.connections.forEach((row) => {
            row.push(false);
          });
        },
        revert : () => {
          this.nodes.pop();
          this.connections.pop();
          this.connections.forEach((row) => {
            row.pop();
          });
        }
      });
    }
    
    appendLink(link : Edge) : void {
      this.execute({
        execute : () => {
          this.links.push(link);
          this.updateConnections();
        },
        revert : () => {
          this.links.pop();
          this.updateConnections();
        }
      });
    }
    
    appendChild(node : Vertex, child : Vertex) : void {
      this.execute({
        execute : () => {
          node.children.push(child);
          this.updateConnections();
        },
        revert : () => {
          node.children.pop();
          this.updateConnections();
        }
      });
    }

    removeNode(removeNode : Vertex) : void {
      var parentNodes = this.nodes.filter(node => node.hasChild(removeNode));
      var previousLinks;
      this.execute({
        execute : () => {
          this.nodes.splice(removeNode.index, 1);
          parentNodes.forEach(node => {
            node.removeChild(removeNode);
          });
          previousLinks = this.links;
          this.links = this.links.filter(link => {
            return link.source != removeNode && link.target != removeNode;
          });
          this.updateConnections();
        },
        revert : () => {
          this.nodes.splice(removeNode.index, 0, removeNode);
          this.updateIndex();
          parentNodes.forEach(node => {
            node.appendChild(removeNode);
          });
          this.links = previousLinks;
          this.updateConnections();
        }
      });
    }

    radderUp(from : Vertex, to : Vertex) : void {
    }
    
    radderDown(from : Vertex, to : Vertex) : void {
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
    
    hasConnection(from : Vertex, to : Vertex) : boolean {
      return this.connections[from.index][to.index];
    }
    
    hasPath(from : Vertex, to : Vertex) : boolean {
      var checkedFlags : boolean[] = this.nodes.map(_ => false);
      var front : Vertex[] = [from];
      while (front.length > 0) {
        var node = front.pop();
        if (node == to) {
          return true;
        }
        if (!checkedFlags[node.index]) {
          node.children.forEach(child => {
            if (!checkedFlags[child.index]) {
              front.push(child);
            }
          });
        }
      }
      return false
    }
    
    private execute(command : Command) : void {
      if (this.transaction) {
        command.execute();
        this.transaction.push(command);
      } else {
        this.transactionWith(() => {
          command.execute();
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
      this.transaction = undefined;
    }
    
    private rollbackTransaction() : void {
      this.transaction.revert();
      this.transaction = undefined;
    }
    
    private updateConnections() : void {
      this.connections = this.nodes.map((_, i) => {
        return this.nodes.map((_, j) => {
          return this.hasPath(this.nodes[i], this.nodes[j]);
        });
      });
    }

    private updateIndex() : void {
      this.nodes.forEach((node, i) => {
        node.index = i;
      });
    }
  }
}

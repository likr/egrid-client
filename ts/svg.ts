module Svg {
  export module Transform {
    export class Translate {
      constructor(public x : number, public y : number) {
      }

      toString() : string {
        return "translate(" + this.x + "," + this.y + ")";
      }
    }

    export class Scale {
      constructor(public sx : number, public sy : number) {
      }

      toString() : string {
        if (this.sy) {
          return "scale(" + this.sx + "," + this.sy + ")";
        } else {
          return "scale(" + this.sx + ")";
        }
      }
    }

    export class Rotate {
      constructor(public angle : number) {
      }

      toString() : string {
        return "rotate(" + this.angle + ")";
      }
    }
  }

  export class Point {
    constructor(public x : number, public y : number) {
    }
  }

  export class Rect {
    constructor(
        public x : number, public y : number,
        public width : number, public height : number,
        public theta : number = 0) {
    }


    left() {
      return new Point(
          - this.width / 2 * Math.cos(this.theta) + this.x,
          this.width / 2 * Math.sin(this.theta) + this.y);
    }


    right() {
      return new Point(
          this.width / 2 * Math.cos(this.theta) + this.x,
          this.width / 2 * Math.sin(this.theta) + this.y);
    }


    top() {
      return new Point(
          this.height / 2 * Math.sin(this.theta) + this.x,
          this.height / 2 * Math.cos(this.theta) + this.y);
    }


    bottom() {
      return new Point(
          this.height / 2 * Math.sin(this.theta) + this.x,
          this.height / 2 * Math.cos(this.theta) + this.y);
    }


    center() {
      return new Point(this.x, this.y);
    }
  }
}
